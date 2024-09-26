// COPYRIGHT DASSAULT SYSTEMES 2024
#include "CAADrwCenterLineCmd.h"
// System
#include "CATLib.h" 
#include "CATUnicodeString.h"
#include "CATIUnknownListImpl.h"
#include "CATIUnknownList.h"
#include "IUnknown.h" 
#include "CATErrorDef.h"
#include "CATIStringList.h"

#include "iostream.h"

// ObjectSpecsModeler
#include "CATISpecObject.h"
#include "CATCreateExternalObject.h"   // Define the CATDeclareClass macro

// Visualization
#include "CATPathElementAgent.h"
#include "CATPathElement.h"
#include "CATSO.h"

// DraftingInterface
#include "IDMCircle2D.h"
#include "IDMPoint2D.h"
#include "CATIDrwCenterLine.h"
#include "CATIDrwAnnotationFactory.h"


#include "CATIDftStandardManager.h"
#include "CATIDftDocumentServices.h"
#include "CATISheet.h"
#include "CATIView.h"
#include "CATDimDefinition.h"
#include "CATDrwUtility.h"

// The command name
CATCreateClass (CAADrwCenterLineCmd);

// ----------------------------------------------------------------------------
CAADrwCenterLineCmd::CAADrwCenterLineCmd():CATStateCommand(CATString("CreateCenterLines"))
, _pObjectAgentA(NULL),_pObjectAgentB(NULL)
{
}

// ----------------------------------------------------------------------------
CAADrwCenterLineCmd::~CAADrwCenterLineCmd()
{
	if (NULL != _pObjectAgentA) {_pObjectAgentA->RequestDelayedDestruction(); _pObjectAgentA = NULL;}
	if (NULL != _pObjectAgentB) {_pObjectAgentB->RequestDelayedDestruction(); _pObjectAgentB = NULL;}
}

// ----------------------------------------------------------------------------
void CAADrwCenterLineCmd::BuildGraph()
{  
	// 创建获取对象A
	_pObjectAgentA = new CATPathElementAgent("_pObjectAgentA A");
	_pObjectAgentA ->SetBehavior( CATDlgEngWithPrevaluation | 
		CATDlgEngMultiAcquisition | 
		CATDlgEngWithCSO); 

	// 只获取点对象
	_pObjectAgentA ->AddElementType("IDMCircle2D");
	AddCSOClient(_pObjectAgentA);

	//  状态1定义
	CATDialogState* pState1 = GetInitialState("Sel point 1");
	pState1->AddDialogAgent(_pObjectAgentA);


	// 创建获取对象B
	_pObjectAgentB = new CATPathElementAgent("_pObjectAgent B");
	_pObjectAgentB ->SetBehavior( CATDlgEngWithPrevaluation | 
		CATDlgEngMultiAcquisition | 
		CATDlgEngWithCSO); 

	// 只获取点对象
	_pObjectAgentB ->AddElementType("IDMLine2D");
	AddCSOClient(_pObjectAgentB);

	//  状态2定义
	CATDialogState* pState2 = AddDialogState("Sel point 2");
	pState2->AddDialogAgent(_pObjectAgentB);

	// 状态转移1-2
	AddTransition(pState1, pState2, IsOutputSetCondition(_pObjectAgentA),
		Action((ActionMethod)&CAADrwCenterLineCmd::ActionOne, NULL, NULL));
	AddTransition(pState2, NULL, IsOutputSetCondition(_pObjectAgentB),
		Action((ActionMethod)&CAADrwCenterLineCmd::ActionTwo, NULL, NULL));
}

// ----------------------------------------------------------------------------
boolean CAADrwCenterLineCmd::ActionOne(void *iData)
{ 
	CATSO* pObjSO = _pObjectAgentA->GetListOfValues(); 
	CATPathElement *pElemPath = NULL;

	if (NULL != pObjSO)  
	{
		pObjSO->InitElementList();
		while (NULL != (pElemPath = (CATPathElement*)pObjSO->NextElement())  )
		{
			piElementRefA = (IDMCircle2D *)pElemPath->FindElement(IID_IDMCircle2D);

		}

		_pObjectAgentA -> InitializeAcquisition();
		return TRUE;
	}
	return FALSE;
}

// ----------------------------------------------------------------------------
boolean CAADrwCenterLineCmd::ActionTwo(void *iData)
{ 
	CATSO* pObjSO = _pObjectAgentB->GetListOfValues(); 
	CATPathElement *pElemPath = NULL;

	if (NULL != pObjSO)  
	{
		pObjSO->InitElementList();
		while (NULL != (pElemPath = (CATPathElement*)pObjSO->NextElement())  )
		{

			// Make sure the element is a point type
			piElementRefB = (IDMLine2D *)pElemPath->FindElement(IID_IDMLine2D);   

			if (NULL != piElementRefB)
			{
				// 创建标注工厂
				CATIDrwAnnotationFactory *piDrwFact = (CATIDrwAnnotationFactory *)pElemPath->FindElement(IID_CATIDrwAnnotationFactory);
				if (NULL != piDrwFact)
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
					if (piElementRefA != NULL) piElementRefA->QueryInterface(IID_IUnknown, (void **)&piLine1);
					if (piElementRefB != NULL) piElementRefB->QueryInterface(IID_IUnknown, (void **)&piLine2);
					if (piSelectionsList)
					{
						piSelectionsList->Add(0, piLine1);
						piSelectionsList->Add(1, piLine2);
					}

					CATIDrwDimDimension * piDimHoriz = NULL;
					double pt1[2], pt2[1];
					piElementRefA->GetCircleData(pt1, pt2);

					double lt1[2], lt2[2];
					piElementRefB->GetLineData(lt1, lt2);
					double  * pts[2] = { NULL, NULL };
					pts[0] = pt1;
					pts[1] = lt1;

					dimDef.Orientation = DrwDimHoriz;
					if (piDrwFact != NULL)  
					{
						piDrwFact->CreateDimension(piSelectionsList,pts,dimType,&dimDef,&piDimHoriz);
					}
					piDrwFact->Release(); piDrwFact=NULL;
				}
				piElementRefB->Release(); piElementRefB=NULL;
			}
		}

		_pObjectAgentB -> InitializeAcquisition();
		return TRUE;
	}
	return FALSE;
}

