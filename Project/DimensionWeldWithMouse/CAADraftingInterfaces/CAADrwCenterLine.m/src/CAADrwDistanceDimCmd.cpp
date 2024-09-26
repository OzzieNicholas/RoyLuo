#include "CAADrwDistanceDimCmd.h"

CATCreateClass(CAADrwDistanceDimCmd);

CAADrwDistanceDimCmd::CAADrwDistanceDimCmd()
: CATCommand(NULL, "CAADrwDistanceDimCmd") {
	RequestStatusChange(CATCommandMsgRequestExclusiveMode);
}

CAADrwDistanceDimCmd::~CAADrwDistanceDimCmd() {}

CATStatusChangeRC CAADrwDistanceDimCmd::Activate(CATCommand *iFromClient, CATNotification *iEvtDat) {
	// 获取当前的编辑器和关联的文档
	CATFrmEditor *pEditor = CATFrmEditor::GetCurrentEditor();
	CATDocument *pDoc = pEditor->GetDocument();

	CATIDftDocumentServices *pDftDocServices = NULL;
	CATIDrawing *pDrawing = NULL;
	CATIDftDrawing *pDftDrawing = NULL;
	CATIContainer_var spDrawingContainer;
	CATIDrwFactory_var spDrawingFactory;

	// 获取工程图文档服务并获取制图对象
	if (SUCCEEDED(pDoc->QueryInterface(IID_CATIDftDocumentServices, (void **)&pDftDocServices))) {
		if (SUCCEEDED(pDftDocServices->GetDrawing(IID_CATIDrawing, (void **)&pDrawing))) {
			pDftDocServices->GetDrawing(IID_CATIDftDrawing, (void **)&pDftDrawing);
			pDftDocServices->Release();
			pDftDocServices = NULL;

			// 转换制图为Object，并获取绘图工厂
			CATISpecObject_var spSpecObject = pDrawing;
			if (spSpecObject != NULL_var) {
				spDrawingContainer = spSpecObject->GetFeatContainer();
				spDrawingFactory = spDrawingContainer;
			}
		}
	}

	// 获取当前表和视图
	CATISheet_var spCurrentSheet;
	if (pDrawing) {
		spCurrentSheet = pDrawing->GetCurrentSheet();
		pDrawing->Release();
		pDrawing = NULL;
	}

	CATIDftSheet *pSheet = NULL;
	CATIDftView *pCurrentView = NULL;
	if (SUCCEEDED(spCurrentSheet->QueryInterface(IID_CATIDftSheet, (void **)&pSheet))) {
		pSheet->GetDefaultActiveView(&pCurrentView);
		pSheet->Release();
		pSheet = NULL;
	}
	
	// 初始化变量以存储最左侧的X坐标
	double mainBodyLeftMostX = DBL_MAX;
	double subBodyLeftMostX = DBL_MAX;

	// 获取视图中所有几何元素
	if (pCurrentView) {
		CATIDftGenGeomAccess *pGenGeomAccess = NULL;
		IUnknown *pGenView = NULL;

		if (SUCCEEDED(pCurrentView->GetApplicativeExtension(IID_CATIDftGenView, &pGenView))) {
			if (SUCCEEDED(pGenView->QueryInterface(IID_CATIDftGenGeomAccess, (void **)&pGenGeomAccess))) {
				CATIUnknownList *pGeomItemList = NULL;
				if (SUCCEEDED(pGenGeomAccess->GetAllGeneratedItems(IID_CATIDftGenGeom, &pGeomItemList))) {
					unsigned int geomItemCount = 0;
					pGeomItemList->Count(&geomItemCount);
					IUnknown *pItem = NULL;
					CATLISTV(CATISpecObject_var) spListElem;

					// 遍历所有几何元素
					for (unsigned int i = 0; i < geomItemCount; i++) {
						if (SUCCEEDED(pGeomItemList->Item(i, &pItem))) {
							// 处理线段
							IDMLine2D_var spLine;
							if (SUCCEEDED(pItem->QueryInterface(IID_IDMLine2D, (void **)&spLine))) {
								double pt1[2], pt2[2];
								spLine->GetLineData(pt1, pt2);
								cout << "\n-----------------------------------------\n" << endl;
								cout << "线段: 起点 (X1 = " << pt1[0] << ", Y1 = " << pt1[1] << ") 终点 (X2 = " << pt2[0] << ", Y2 = " << pt2[1] << ")" << endl;
								spListElem.Append(spLine);
								// 获取元素所属的body名称
								CATUnicodeString bodyName = GetParentBodyAndPart(pItem);
								// 获取该线段最左侧的X坐标
								double leftMostX = (pt1[0] < pt2[0]) ? pt1[0] : pt2[0];
								cout << "leftMostX: " << leftMostX << endl;
								// 判断是否为主body
								if (bodyName == "零件几何体") {
									if (leftMostX < mainBodyLeftMostX) {
										mainBodyLeftMostX = leftMostX;
									}
								} else {
									// 如果不是主body，则为副body
									if (leftMostX < subBodyLeftMostX) {
										subBodyLeftMostX = leftMostX;
									}
								}
							}

							// 处理圆
							IDMCircle2D_var spCircle;
							if (SUCCEEDED(pItem->QueryInterface(IID_IDMCircle2D, (void **)&spCircle))) {
								double center[2], radius;
								spCircle->GetCircleData(center, &radius);
								cout << "\n-----------------------------------------\n" << endl;
								cout << "圆: 圆心 (X = " << center[0] << ", Y = " << center[1] << "), 半径 = " << radius << endl;
								spListElem.Append(spCircle);
								GetParentBodyAndPart(pItem);
							}

							// 处理椭圆
							IDMEllipse2D_var spEllipse;
							if (SUCCEEDED(pItem->QueryInterface(IID_IDMEllipse2D, (void **)&spEllipse))) {
								cout << "\n-----------------------------------------\n" << endl;
								cout << "椭圆: 检测到椭圆" << endl;
								spListElem.Append(spEllipse);
								GetParentBodyAndPart(pItem);
							}

							// 处理曲线
							IDMCurve2D_var spCurve;
							if (SUCCEEDED(pItem->QueryInterface(IID_IDMCurve2D, (void **)&spCurve))) {
								cout << "\n-----------------------------------------\n" << endl;
								cout << "曲线: 检测到曲线" << endl;
								spListElem.Append(spCurve);
								GetParentBodyAndPart(pItem);
							}

							// 处理折线
							IDMPolyline2D_var spPolyline;
							if (SUCCEEDED(pItem->QueryInterface(IID_IDMPolyline2D, (void **)&spPolyline))) {
								cout << "折线: 检测到折线" << endl;
								spListElem.Append(spPolyline);
								GetParentBodyAndPart(pItem);
							}

							// 释放当前几何元素
							pItem->Release();
							pItem = NULL;
						}
					}

					// 如果找到了有效的最左侧X坐标，计算并打印距离
					if (mainBodyLeftMostX != DBL_MAX && subBodyLeftMostX != DBL_MAX) {
						double weldingDistance = subBodyLeftMostX - mainBodyLeftMostX;
						cout << "主body和副body之间的焊接距离为: " << weldingDistance << endl;
					} else {
						cout << "未找到有效的线段来计算焊接距离" << endl;
					}

					// 如果未找到任何几何元素，则结束命令
					if (spListElem.Size() == 0) {
						return (CATStatusChangeRCCompleted);
					}
				}

				// 清理几何访问接口
				pGenGeomAccess->Release();
				pGenGeomAccess = NULL;
			}

			// 清理视图接口
			pGenView->Release();
			pGenView = NULL;
		}

		// 清理视图对象
		pCurrentView->Release();
		pCurrentView = NULL;
	}

	return (CATStatusChangeRCCompleted);
}

// 获取投影零件的名称，获取投影几何体的名称
CATUnicodeString CAADrwDistanceDimCmd::GetParentBodyAndPart(IUnknown *pItem) {
	CATUnicodeString bodyName = "";
	CATIDftGenGeom *piGenGeom = NULL;
	if (SUCCEEDED(pItem->QueryInterface(IID_CATIDftGenGeom, (void **)&piGenGeom))) {
		// 获取投影几何体
		CATBody *piBody = NULL;
		if (SUCCEEDED(piGenGeom->GetBody(&piBody)) && piBody != NULL) {
			CATLISTP(CATCell) *plistCell = NULL;
			if (SUCCEEDED(piGenGeom->GetGeometryOfOrigin(&plistCell)) && plistCell != NULL && plistCell->Size() > 0) {
				CATCell_var spCell = (*plistCell)[1];
				if (spCell != NULL_var) {
					CATIBRepAccess_var spBrepass = CATBRepDecodeCellInBody(spCell, piBody);
					if (spBrepass != NULL_var) {
						CATISpecObject_var spobject = spBrepass->GetInitialFeature();
						CATIAlias_var spalias = spobject;
						if (spalias != NULL_var) {
							bodyName = spalias->GetAlias();
							cout << "投影几何体的名称: " << spalias->GetAlias() << endl;
						}
					}
				}
			}
		}

		// 获取投影零件
		IUnknown *piUnknownProduct = NULL;
		if (SUCCEEDED(piGenGeom->GetProduct(IID_CATIProduct, &piUnknownProduct)) && piUnknownProduct != NULL) {
			CATIProduct *piProd = NULL;
			if (SUCCEEDED(piUnknownProduct->QueryInterface(IID_CATIProduct, (void **)&piProd))) {
				CATIProduct_var ospiProd = piProd;
				CATUnicodeString strPartNumber = piProd->GetPartNumber();
				cout << "投影零件的名称: " << strPartNumber << endl;
			}
		}
	}

	return bodyName;
}

CATStatusChangeRC CAADrwDistanceDimCmd::Desactivate(CATCommand *iFromClient,
													CATNotification *iEvtDat) {
	return (CATStatusChangeRCCompleted);
}

CATStatusChangeRC CAADrwDistanceDimCmd::Cancel(CATCommand *iFromClient,
											   CATNotification *iEvtDat) {
	RequestDelayedDestruction();
	return (CATStatusChangeRCCompleted);
}
