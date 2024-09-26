## 视图

```cpp
/**
 * @brief 获取当前图纸的所有视图对象。
 * 
 * @param sheet 当前的 CATIA Drawing 图纸。
 * @return CATLISTP(IUnknown) 包含所有视图的列表。
 */
CATLISTP(IUnknown) CAADrwDistanceDimCmd::GetAllViews(const CATIDftSheet* sheet) {
	CATIUnknownList* piListOfViewMU = NULL;
	if (FAILED(sheet->GetViewMakeUps(&piListOfViewMU))) {
		std::cout << "无法获取视图列表。" << std::endl;
		return CATLISTP(IUnknown)();
	}

	CATLISTP(IUnknown) listViews;
	unsigned int viewMUNumber = 0;
	piListOfViewMU->Count(&viewMUNumber);

	// 输出调试信息，确保视图数量是正确的
	std::cout << "视图数量: " << viewMUNumber << std::endl;

	if (viewMUNumber == 0) {
		std::cout << "没有视图可供处理。" << std::endl;
		return listViews;
	}

	IUnknown* item = NULL;
	CATIDftViewMakeUp* piViewMakeUp = NULL;
	CATIView* piView = NULL;
	CATIDftView* piDftView = NULL;

	for (unsigned int i = 0; i < viewMUNumber; i++) {
		std::cout << "处理视图索引: " << i << std::endl;
		HRESULT hrItem = piListOfViewMU->Item(i, &item);
		if (SUCCEEDED(hrItem)) {
			std::cout << "成功获取视图MakeUp对象，索引: " << i << std::endl;
			piViewMakeUp = (CATIDftViewMakeUp*)item;
			if (piViewMakeUp != NULL) {
				HRESULT hrView = piViewMakeUp->GetView(&piView);
				if (SUCCEEDED(hrView) && piView != NULL) {
					std::cout << "成功获取视图对象，索引: " << i << std::endl;
					HRESULT hrDftView = piView->QueryInterface(IID_CATIDftView, (void**)&piDftView);
					if (SUCCEEDED(hrDftView) && piDftView != NULL) {
						std::cout << "成功获取 DftView 接口，索引: " << i << std::endl;
						listViews.Append(piDftView);
						std::cout << "视图成功添加到listViews，当前listViews大小: " << listViews.Size() << std::endl;
					} else {
						std::cout << "无法获取 DftView 接口，索引: " << i << std::endl;
					}
					piView->Release();
					piView = NULL;
				} else {
					std::cout << "视图对象为空或无法获取，索引: " << i << std::endl;
				}
			} else {
				std::cout << "视图MakeUp对象为空，索引: " << i << std::endl;
			}
		} else {
			std::cout << "获取视图失败，索引: " << i << " HRESULT: " << hrItem << std::endl;
		}
	}

	return listViews;
}
```



## 线段

```cpp
/**
 * @brief 创建一条距离标注，基于给定的两条线段和视图。
 *
 * @param line1 第一条线段的接口，类型为 IDMLine2D_var。
 * @param line2 第二条线段的接口，类型为 IDMLine2D_var。
 * @param view 当前视图的接口，类型为 CATIView_var。
 *
 * @details
 * 此函数将通过查询视图接口获取标注工厂，然后创建一条距离标注。
 * 函数内部会处理线段数据，并将其添加到选择列表中。
 * 最后，使用标注工厂的创建方法生成标注，并进行必要的内存清理。
 * 
 * @return 无返回值。
 */
void CAADrwDistanceDimCmd::CreateLineDimension(IDMLine2D_var line1, IDMLine2D_var line2, CATIView_var view)
{
	CATIDrwAnnotationFactory_var piDrwFact;

	if (SUCCEEDED(view->QueryInterface(IID_CATIDrwAnnotationFactory, (void**)&piDrwFact)))
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
				if (line1 != NULL) line1->QueryInterface(IID_IUnknown, (void**)&piLine1);
				if (line2 != NULL) line2->QueryInterface(IID_IUnknown, (void**)&piLine2);

				if (piSelectionsList)
				{
					piSelectionsList->Add(0, piLine1);
					piSelectionsList->Add(1, piLine2);
				}

				CATIDrwDimDimension *piDimHoriz = NULL;
				double pt1[2], pt2[2];
				line1->GetLineData(pt1, pt2);
				double pt3[2], pt4[2];
				line2->GetLineData(pt3, pt4);
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
}
```

```cpp
/**
 * @brief 判断两条线段是否属于同一几何体。
 * 
 * 通过比较两条线段的父对象，判断它们是否属于相同的几何体。
 * @param line1 第一个线段对象。
 * @param line2 第二个线段对象。
 * @return true 如果两条线段属于相同的几何体。
 */
bool CAADrwDistanceDimCmd::CheckIfSameBody(IDMLine2D_var &line1, IDMLine2D_var &line2) {
	CATISpecObject_var specObject1 = line1;
	CATISpecObject_var specObject2 = line2;

	if (specObject1 != NULL_var && specObject2 != NULL_var) {
		CATISpecObject_var father1 = specObject1->GetFather();
		CATISpecObject_var father2 = specObject2->GetFather();

		// 判断两条线段是否具有相同的父对象
		if (father1 == father2) {
			return true;
		}
	}
	return false;
}
```

```cpp
/**
 * @brief 获取几何元素的所属几何体和零件名称。
 * 
 * 获取指定几何元素的父几何体和零件的名称，用于标识几何元素所属的 Body。
 * @param item 当前的几何元素。
 * @return CATUnicodeString 几何体名称。
 */
CATUnicodeString CAADrwDistanceDimCmd::GetParentBodyAndPart(IUnknown *item) {
	CATUnicodeString bodyName = "";
	CATIDftGenGeom *piGenGeom = NULL;
	if (SUCCEEDED(item->QueryInterface(IID_CATIDftGenGeom, (void **)&piGenGeom))) {
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
							std::cout << "投影几何体的名称: " << spalias->GetAlias() << std::endl;
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
				std::cout << "投影零件的名称: " << strPartNumber << std::endl;
			}
		}
	}

	return bodyName;
}
```





