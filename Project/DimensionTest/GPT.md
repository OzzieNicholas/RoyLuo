## GPT

```cpp
环境：CATIAV5R19，CAA，VS2005
需求：我的代码是正确的，请分析代码的功能，代码如下（中文回答）：

.h代码：

// ... 头文件省略
class CAADrwDistanceDimCmd: public CATCommand
{
public:

	CAADrwDistanceDimCmd();
	virtual ~CAADrwDistanceDimCmd();
	IDMLine2D_var spElementLine1;  // 第一条线段
	IDMLine2D_var spElementLine2;  // 第二条线段

	virtual CATStatusChangeRC Activate(
		CATCommand * iFromClient,
		CATNotification * iEvtDat);

	virtual CATStatusChangeRC Desactivate(
		CATCommand * iFromClient,
		CATNotification * iEvtDat);

	virtual CATStatusChangeRC Cancel(
		CATCommand * iFromClient,
		CATNotification * iEvtDat);
};

.cpp代码：

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

CATStatusChangeRC CAADrwDistanceDimCmd::Activate( CATCommand * iFromClient, CATNotification * iEvtDat)
{

	CATIDrawing *piDrawing = NULL;
	CATDocument* pDoc = NULL;
	CATIDftDrawing *piDftDrawing;

	//获得Editor、获得Document、获得DocumentRoot
	CATFrmEditor* pEditor = CATFrmEditor::GetCurrentEditor();
	pDoc = pEditor->GetDocument();

	// Session 方式CATDocumentServices::New("Drawing",pDoc);
	CATIDftDocumentServices *piDftDocServices = NULL;
	CATIContainer_var spDrwcont;
	CATISpecObject_var spSpecObj;
	CATIDrwFactory_var spDrwFact;
	if (SUCCEEDED(pDoc->QueryInterface(IID_CATIDftDocumentServices, (void **)&piDftDocServices)))
	{
		//获取制图
		if (SUCCEEDED(piDftDocServices->GetDrawing(IID_CATIDrawing, (void **)&piDrawing)))
		{

			piDftDocServices->GetDrawing(IID_CATIDftDrawing, (void **)&piDftDrawing);//获取制图
			piDftDocServices->Release();
			piDftDocServices = NULL;

			spSpecObj=piDrawing;//转化制图为Object
			if (spSpecObj != NULL_var) 
			{
				spDrwcont = spSpecObj->GetFeatContainer();//获取CATIContainer
			}
			spDrwFact = spDrwcont;//制图工厂赋值
		}

	}

	// 获取当前表主视图
	CATISheet_var spSheet;
	if (piDrawing)
	{
		spSheet = piDrawing->GetCurrentSheet();
		piDrawing->Release();
		piDrawing = NULL;
	}

	CATIDftSheet *piSheet = NULL;
	CATIDftView *piCurrentView = NULL;

	if (SUCCEEDED(spSheet->QueryInterface(IID_CATIDftSheet,(void**) & piSheet) ) )
	{
		piSheet->GetDefaultActiveView(&piCurrentView);
		piSheet->Release();
		piSheet=NULL;
	}

	CATIView_var spMainView;
	if ( spSheet != NULL_var) 
	{
		spMainView = spSheet->GetCurrentView();
	}

	if (spSheet != NULL_var) 
	{
		spSheet->SetCurrentView(spMainView);
	}

	CATIDftGenGeomAccess *piGenGeomAccess = NULL;
	CATLISTV(CATISpecObject_var) spListElem;
	IUnknown *piGenView = NULL;
	if (NULL != piCurrentView)
	{
		if (SUCCEEDED( piCurrentView->GetApplicativeExtension(IID_CATIDftGenView,&piGenView)))
		{
			if (SUCCEEDED( piGenView->QueryInterface(IID_CATIDftGenGeomAccess, (void**) & piGenGeomAccess) ) )
			{
				CATIUnknownList * piList = NULL;

				// 获取生成Ⅹ视图中包含的所有几何元素
				if( SUCCEEDED( piGenGeomAccess->GetAllGeneratedItems(IID_CATIDftGenGeom, &piList) ) )
				{
					unsigned int piListSize = 0;
					piList->Count(&piListSize);

					CATIDftGenGeom * piGenGeom = NULL;
					IUnknown * item = NULL;
					CATUnicodeString  PartName;

					// 循环当前视图几何元素
					for(unsigned int i=0 ; i<piListSize ; i++)
					{

						if( SUCCEEDED( piList->Item(i, &item) ) )
						{
							IDMLine2D_var spPotItem;
							CATUnicodeString namealias;
							if(SUCCEEDED( item->QueryInterface(IID_IDMLine2D, (void**) & spPotItem) ) )
							{
								double pt1[2],pt2[2];
								spPotItem->GetLineData(pt1, pt2);
								cout << "X = " << pt1[0] << " Y =" << pt1[1] << endl;
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
			piGenView->Release() , piGenView=NULL;
		}
		// 内存清理
		piCurrentView->Release() , piCurrentView=NULL;
	}

	if (spListElem.Size() == 0) 
	{
		return (CATStatusChangeRCCompleted);
	}

	spElementLine1 = spListElem[1];
	spElementLine2= spListElem[4];
	// 创建标注工厂
	CATIDrwAnnotationFactory_var piDrwFact = spMainView;
	if (NULL_var != piDrwFact)
	{
		// 创建点到点垂直距离
		CATDrwDimType dimType = DrwDimDistance;
		CATDimDefinition dimDef;
		CATIUnknownList * piSelectionsList =NULL;
		CATIUnknownListImpl * piListsel = new CATIUnknownListImpl();
		piListsel->QueryInterface(IID_CATIUnknownList, (void **) &piSelectionsList);
		piListsel->Release(); piListsel=NULL;

		IUnknown * piLine1 = NULL;
		IUnknown * piLine2 = NULL;
		if (spElementLine1 != NULL) spElementLine1->QueryInterface(IID_IUnknown, (void **)&piLine1);
		if (spElementLine2 != NULL) spElementLine2->QueryInterface(IID_IUnknown, (void **)&piLine2);
		if (piSelectionsList)
		{
			piSelectionsList->Add(0, piLine1);
			piSelectionsList->Add(1, piLine2);
		}

		CATIDrwDimDimension * piDimHoriz = NULL;
		double pt1[2], pt2[2];
		spElementLine1->GetLineData(pt1,pt2);
		double pt3[2], pt4[2];
		spElementLine2->GetLineData(pt3,pt4);
		double  * pts[2] = { NULL, NULL };
		pts[0] = pt1;
		pts[1] = pt3;

		dimDef.Orientation = DrwDimHoriz;
		if (piDrwFact != NULL)  
		{
			piDrwFact->CreateDimension(piSelectionsList,pts,dimType,&dimDef,&piDimHoriz);
		}
		piDrwFact->Release();
		piDrwFact=NULL;
	}
	spElementLine1->Release(); 
	spElementLine1=NULL;
	spElementLine2->Release(); 
	spElementLine2=NULL;

	return (CATStatusChangeRCCompleted);
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
```

```
上述代码是没问题的，运行代码，可以自动标注两条线段之间的距离，但我现在想实现的代码抽离，将两条线段之间的标注单独整理成一个函数，我该怎么写呢
```

## BackUP

```cpp
#ifndef CAADrwDistanceDimCmd_H
#define CAADrwDistanceDimCmd_H

// System
#include "CATLib.h" 
#include "CATUnicodeString.h"
#include "CATIUnknownListImpl.h"
#include "CATIUnknownList.h"
#include "IUnknown.h" 
#include "CATErrorDef.h"
#include "CATIStringList.h"

// CATApplicationFrame 
#include "CATFrmEditor.h"

// ObjectSpecsModeler
#include "CATISpecObject.h"
#include "CATCreateExternalObject.h"
#include "CATIDescendants.h"

// ObjectModelerBase
#include "CATIAlias.h"
#include "CATDocument.h"
#include "CATDocumentServices.h"
#include "CATSessionServices.h" 
#include "CATIContainer.h"

// Visualization
#include "CATPathElementAgent.h"
#include "CATPathElement.h"
#include "CATSO.h"

// SketcherInterfaces
#include "CATI2DWFGeometry.h"

// DraftingInterfaces
#include "CATISheet.h"
#include "CATIView.h"
#include "CATIDrwFactory.h"
#include "CATIDftDrawing.h"
#include "CATIDftDocumentServices.h"
#include "CATIDrwAnnotationFactory.h"
#include "CATIDftHatchingPattern.h"
#include "CATIDrwBreakElem.h"
#include "CATIDrwBreakElemFactory.h"
#include "CATDimDefinition.h"
#include "CATDrwUtility.h"
#include "CATIDftStandardManager.h"
#include "CATIDftView.h"
#include "CATIDftGenGeomAccess.h"
#include "CATIDftGenView.h"
#include "CATIDftGenGeom.h"
#include "CATCrvEvalLocal.h"
#include "CATCrvParam.h"
#include "CATIDrwDressUp.h"
#include "CATI2DWFFactory.h"
#include "CATPoint.h"
#include "CATCurve.h"
#include "CATIDftSheet.h"
#include "CATCommand.h"
#include "IDMCircle2D.h"
#include "IDMPoint2D.h"
#include "IDMLine2D.h"
#include "IDMCurve2D.h"
#include "CATI2DPoint.h"
#include "IDMPolyline2D.h"

// Mathematic constants
#include "CATMathDef.h"

// CPP
#include "iostream.h"

class CAADrwDistanceDimCmd: public CATCommand
{
public:

	CAADrwDistanceDimCmd();
	virtual ~CAADrwDistanceDimCmd();
	IDMLine2D_var spElementLine1;  // 第一条线段
	IDMLine2D_var spElementLine2;  // 第二条线段

	virtual CATStatusChangeRC Activate(
		CATCommand * iFromClient,
		CATNotification * iEvtDat);

	virtual CATStatusChangeRC Desactivate(
		CATCommand * iFromClient,
		CATNotification * iEvtDat);

	virtual CATStatusChangeRC Cancel(
		CATCommand * iFromClient,
		CATNotification * iEvtDat);

};

#endif
```

```cpp
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

CATStatusChangeRC CAADrwDistanceDimCmd::Activate( CATCommand * iFromClient, CATNotification * iEvtDat)
{

	CATIDrawing *piDrawing = NULL;
	CATDocument* pDoc = NULL;
	CATIDftDrawing *piDftDrawing;

	//获得Editor、获得Document、获得DocumentRoot
	CATFrmEditor* pEditor = CATFrmEditor::GetCurrentEditor();
	pDoc = pEditor->GetDocument();

	// Session 方式CATDocumentServices::New("Drawing",pDoc);
	CATIDftDocumentServices *piDftDocServices = NULL;
	CATIContainer_var spDrwcont;
	CATISpecObject_var spSpecObj;
	CATIDrwFactory_var spDrwFact;
	if (SUCCEEDED(pDoc->QueryInterface(IID_CATIDftDocumentServices, (void **)&piDftDocServices)))
	{
		//获取制图
		if (SUCCEEDED(piDftDocServices->GetDrawing(IID_CATIDrawing, (void **)&piDrawing)))
		{

			piDftDocServices->GetDrawing(IID_CATIDftDrawing, (void **)&piDftDrawing);//获取制图
			piDftDocServices->Release();
			piDftDocServices = NULL;

			spSpecObj=piDrawing;//转化制图为Object
			if (spSpecObj != NULL_var) 
			{
				spDrwcont = spSpecObj->GetFeatContainer();//获取CATIContainer
			}
			spDrwFact = spDrwcont;//制图工厂赋值
		}

	}

	// 获取当前表主视图
	CATISheet_var spSheet;
	if (piDrawing)
	{
		spSheet = piDrawing->GetCurrentSheet();
		piDrawing->Release();
		piDrawing = NULL;
	}

	CATIDftSheet *piSheet = NULL;
	CATIDftView *piCurrentView = NULL;

	if (SUCCEEDED(spSheet->QueryInterface(IID_CATIDftSheet,(void**) & piSheet) ) )
	{
		piSheet->GetDefaultActiveView(&piCurrentView);
		piSheet->Release();
		piSheet=NULL;
	}

	CATIView_var spMainView;
	if ( spSheet != NULL_var) 
	{
		spMainView = spSheet->GetCurrentView();
	}

	if (spSheet != NULL_var) 
	{
		spSheet->SetCurrentView(spMainView);
	}

	CATIDftGenGeomAccess *piGenGeomAccess = NULL;
	CATLISTV(CATISpecObject_var) spListElem;
	IUnknown *piGenView = NULL;
	if (NULL != piCurrentView)
	{
		if (SUCCEEDED( piCurrentView->GetApplicativeExtension(IID_CATIDftGenView,&piGenView)))
		{
			if (SUCCEEDED( piGenView->QueryInterface(IID_CATIDftGenGeomAccess, (void**) & piGenGeomAccess) ) )
			{
				CATIUnknownList * piList = NULL;

				// 获取生成Ⅹ视图中包含的所有几何元素
				if( SUCCEEDED( piGenGeomAccess->GetAllGeneratedItems(IID_CATIDftGenGeom, &piList) ) )
				{
					unsigned int piListSize = 0;
					piList->Count(&piListSize);

					CATIDftGenGeom * piGenGeom = NULL;
					IUnknown * item = NULL;
					CATUnicodeString  PartName;

					// 循环当前视图几何元素
					for(unsigned int i=0 ; i<piListSize ; i++)
					{

						if( SUCCEEDED( piList->Item(i, &item) ) )
						{
							IDMLine2D_var spPotItem;
							CATUnicodeString namealias;
							if(SUCCEEDED( item->QueryInterface(IID_IDMLine2D, (void**) & spPotItem) ) )
							{
								double pt1[2],pt2[2];
								spPotItem->GetLineData(pt1, pt2);
								cout << "X = " << pt1[0] << " Y =" << pt1[1] << endl;
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
			piGenView->Release() , piGenView=NULL;
		}
		// 内存清理
		piCurrentView->Release() , piCurrentView=NULL;
	}

	if (spListElem.Size() == 0) 
	{
		return (CATStatusChangeRCCompleted);
	}

	spElementLine1 = spListElem[1];
	spElementLine2= spListElem[4];
	// 创建标注工厂
	CATIDrwAnnotationFactory_var piDrwFact = spMainView;
	if (NULL_var != piDrwFact)
	{
		// 创建点到点垂直距离
		CATDrwDimType dimType = DrwDimDistance;
		CATDimDefinition dimDef;
		CATIUnknownList * piSelectionsList =NULL;
		CATIUnknownListImpl * piListsel = new CATIUnknownListImpl();
		piListsel->QueryInterface(IID_CATIUnknownList, (void **) &piSelectionsList);
		piListsel->Release(); piListsel=NULL;

		IUnknown * piLine1 = NULL;
		IUnknown * piLine2 = NULL;
		if (spElementLine1 != NULL) spElementLine1->QueryInterface(IID_IUnknown, (void **)&piLine1);
		if (spElementLine2 != NULL) spElementLine2->QueryInterface(IID_IUnknown, (void **)&piLine2);
		if (piSelectionsList)
		{
			piSelectionsList->Add(0, piLine1);
			piSelectionsList->Add(1, piLine2);
		}

		CATIDrwDimDimension * piDimHoriz = NULL;
		double pt1[2], pt2[2];
		spElementLine1->GetLineData(pt1,pt2);
		double pt3[2], pt4[2];
		spElementLine2->GetLineData(pt3,pt4);
		double  * pts[2] = { NULL, NULL };
		pts[0] = pt1;
		pts[1] = pt3;

		dimDef.Orientation = DrwDimHoriz;
		if (piDrwFact != NULL)  
		{
			piDrwFact->CreateDimension(piSelectionsList,pts,dimType,&dimDef,&piDimHoriz);
		}
		piDrwFact->Release();
		piDrwFact=NULL;
	}
	spElementLine1->Release(); 
	spElementLine1=NULL;
	spElementLine2->Release(); 
	spElementLine2=NULL;

	return (CATStatusChangeRCCompleted);
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
```

