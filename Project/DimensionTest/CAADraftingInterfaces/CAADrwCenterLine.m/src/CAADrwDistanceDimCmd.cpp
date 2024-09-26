#include "CAADrwDistanceDimCmd.h"

CATCreateClass( CAADrwDistanceDimCmd);

CAADrwDistanceDimCmd::CAADrwDistanceDimCmd() :
CATCommand (NULL, "CAADrwDistanceDimCmd")
{
	RequestStatusChange (CATCommandMsgRequestExclusiveMode);
}

CAADrwDistanceDimCmd::~CAADrwDistanceDimCmd()
{
}

CATStatusChangeRC CAADrwDistanceDimCmd::Activate(CATCommand * iFromClient, CATNotification * iEvtDat)
{
	// 声明和初始化变量
	CATIDrawing *piDrawing = NULL;
	CATDocument* pDoc = NULL;
	CATIDftDrawing *piDftDrawing;

	// 获取当前编辑器和文档
	CATFrmEditor* pEditor = CATFrmEditor::GetCurrentEditor();
	pDoc = pEditor->GetDocument();

	// 获取制图服务接口
	CATIDftDocumentServices *piDftDocServices = NULL;
	CATISpecObject_var spSpecObj;
	CATIDrwFactory_var spDrwFact;

	if (SUCCEEDED(pDoc->QueryInterface(IID_CATIDftDocumentServices, (void **)&piDftDocServices)))
	{
		// 获取绘图对象
		if (SUCCEEDED(piDftDocServices->GetDrawing(IID_CATIDrawing, (void **)&piDrawing)))
		{
			piDftDocServices->GetDrawing(IID_CATIDftDrawing, (void **)&piDftDrawing);
			piDftDocServices->Release();
			piDftDocServices = NULL;

			spSpecObj = piDrawing; // 转化为对象
			if (spSpecObj != NULL_var) 
			{
				spDrwFact = spSpecObj->GetFeatContainer(); // 获取特征容器
			}
		}
	}

	// 获取当前表的主视图
	CATISheet_var spSheet;
	if (piDrawing)
	{
		spSheet = piDrawing->GetCurrentSheet();
		piDrawing->Release();
		piDrawing = NULL;
	}

	CATIDftSheet *piSheet = NULL;
	CATIDftView *piCurrentView = NULL;

	if (SUCCEEDED(spSheet->QueryInterface(IID_CATIDftSheet, (void**)&piSheet)))
	{
		piSheet->GetDefaultActiveView(&piCurrentView);
		piSheet->Release();
		piSheet = NULL;
	}

	// 获取当前视图
	CATIView_var spMainView;
	if (spSheet != NULL_var) 
	{
		spMainView = spSheet->GetCurrentView();
	}

	if (spSheet != NULL_var) 
	{
		spSheet->SetCurrentView(spMainView);
	}

	// 获取几何元素访问接口
	CATIDftGenGeomAccess *piGenGeomAccess = NULL;
	CATLISTV(CATISpecObject_var) spListElem;
	IUnknown *piGenView = NULL;

	if (NULL != piCurrentView)
	{
		if (SUCCEEDED(piCurrentView->GetApplicativeExtension(IID_CATIDftGenView, &piGenView)))
		{
			if (SUCCEEDED(piGenView->QueryInterface(IID_CATIDftGenGeomAccess, (void**)&piGenGeomAccess)))
			{
				CATIUnknownList *piList = NULL;

				// 获取生成视图中的所有几何元素
				if (SUCCEEDED(piGenGeomAccess->GetAllGeneratedItems(IID_CATIDftGenGeom, &piList)))
				{
					unsigned int piListSize = 0;
					piList->Count(&piListSize);

					// 遍历几何元素并获取线段
					for (unsigned int i = 0; i < piListSize; i++)
					{
						IUnknown *item = NULL;
						if (SUCCEEDED(piList->Item(i, &item)))
						{
							IDMLine2D_var spPotItem;
							if (SUCCEEDED(item->QueryInterface(IID_IDMLine2D, (void**)&spPotItem)))
							{
								double pt1[2], pt2[2];
								spPotItem->GetLineData(pt1, pt2);
								spListElem.Append(spPotItem);
								item->Release();
								item = NULL;
							}
						}
					}
					// 内存清理
					piList->Release();
					piList = NULL;    
				}
				// 内存清理
				piGenGeomAccess->Release(), piGenGeomAccess = NULL;
			}
			// 内存清理
			piGenView->Release(), piGenView = NULL;
		}
		// 内存清理
		piCurrentView->Release(), piCurrentView = NULL;
	}

	// 如果没有找到线段，则返回
	if (spListElem.Size() == 0) 
	{
		return (CATStatusChangeRCCompleted);
	}

	// 选取线段并创建距离标注
	spElementLine1 = spListElem[1];
	spElementLine2 = spListElem[4];
	CATIDrwAnnotationFactory_var piDrwFact = spMainView;
	CreateLineDimension(spElementLine1, spElementLine2, piDrwFact);

	// 释放线段对象
	spElementLine1->Release(); 
	spElementLine1 = NULL;
	spElementLine2->Release(); 
	spElementLine2 = NULL;

	return (CATStatusChangeRCCompleted);
}

void CAADrwDistanceDimCmd::CreateLineDimension(IDMLine2D_var spLine1, IDMLine2D_var spLine2, CATIDrwAnnotationFactory_var piDrwFact)
{
	if (NULL_var != piDrwFact)
	{
		CATDrwDimType dimType = DrwDimDistance;
		CATDimDefinition dimDef;
		CATIUnknownList *piSelectionsList = NULL;
		CATIUnknownListImpl *piListsel = new CATIUnknownListImpl();

		if (SUCCEEDED(piListsel->QueryInterface(IID_CATIUnknownList, (void **)&piSelectionsList)))
		{
			IUnknown *piLine1 = NULL;
			IUnknown *piLine2 = NULL;
			if (spLine1 != NULL) spLine1->QueryInterface(IID_IUnknown, (void**)&piLine1);
			if (spLine2 != NULL) spLine2->QueryInterface(IID_IUnknown, (void**)&piLine2);

			if (piSelectionsList)
			{
				piSelectionsList->Add(0, piLine1);
				piSelectionsList->Add(1, piLine2);
			}

			CATIDrwDimDimension *piDimHoriz = NULL;
			double pt1[2], pt2[2];
			spLine1->GetLineData(pt1, pt2);
			double pt3[2], pt4[2];
			spLine2->GetLineData(pt3, pt4);
			double *pts[2] = { pt1, pt3 };

			dimDef.Orientation = DrwDimHoriz;
			piDrwFact->CreateDimension(piSelectionsList, pts, dimType, &dimDef, &piDimHoriz);

			// 清理内存
			if (piSelectionsList) piSelectionsList->Release();
			if (piLine1) piLine1->Release();
			if (piLine2) piLine2->Release();
		}

		delete piListsel;
	}
}

CATStatusChangeRC CAADrwDistanceDimCmd::Desactivate( CATCommand * iFromClient, CATNotification * iEvtDat)
{
	return (CATStatusChangeRCCompleted);
}

CATStatusChangeRC CAADrwDistanceDimCmd::Cancel( CATCommand * iFromClient, CATNotification * iEvtDat)
{
	RequestDelayedDestruction();
	return (CATStatusChangeRCCompleted);
}
