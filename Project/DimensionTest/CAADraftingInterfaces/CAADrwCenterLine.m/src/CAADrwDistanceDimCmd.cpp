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
	// �����ͳ�ʼ������
	CATIDrawing *piDrawing = NULL;
	CATDocument* pDoc = NULL;
	CATIDftDrawing *piDftDrawing;

	// ��ȡ��ǰ�༭�����ĵ�
	CATFrmEditor* pEditor = CATFrmEditor::GetCurrentEditor();
	pDoc = pEditor->GetDocument();

	// ��ȡ��ͼ����ӿ�
	CATIDftDocumentServices *piDftDocServices = NULL;
	CATISpecObject_var spSpecObj;
	CATIDrwFactory_var spDrwFact;

	if (SUCCEEDED(pDoc->QueryInterface(IID_CATIDftDocumentServices, (void **)&piDftDocServices)))
	{
		// ��ȡ��ͼ����
		if (SUCCEEDED(piDftDocServices->GetDrawing(IID_CATIDrawing, (void **)&piDrawing)))
		{
			piDftDocServices->GetDrawing(IID_CATIDftDrawing, (void **)&piDftDrawing);
			piDftDocServices->Release();
			piDftDocServices = NULL;

			spSpecObj = piDrawing; // ת��Ϊ����
			if (spSpecObj != NULL_var) 
			{
				spDrwFact = spSpecObj->GetFeatContainer(); // ��ȡ��������
			}
		}
	}

	// ��ȡ��ǰ�������ͼ
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

	// ��ȡ��ǰ��ͼ
	CATIView_var spMainView;
	if (spSheet != NULL_var) 
	{
		spMainView = spSheet->GetCurrentView();
	}

	if (spSheet != NULL_var) 
	{
		spSheet->SetCurrentView(spMainView);
	}

	// ��ȡ����Ԫ�ط��ʽӿ�
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

				// ��ȡ������ͼ�е����м���Ԫ��
				if (SUCCEEDED(piGenGeomAccess->GetAllGeneratedItems(IID_CATIDftGenGeom, &piList)))
				{
					unsigned int piListSize = 0;
					piList->Count(&piListSize);

					// ��������Ԫ�ز���ȡ�߶�
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
					// �ڴ�����
					piList->Release();
					piList = NULL;    
				}
				// �ڴ�����
				piGenGeomAccess->Release(), piGenGeomAccess = NULL;
			}
			// �ڴ�����
			piGenView->Release(), piGenView = NULL;
		}
		// �ڴ�����
		piCurrentView->Release(), piCurrentView = NULL;
	}

	// ���û���ҵ��߶Σ��򷵻�
	if (spListElem.Size() == 0) 
	{
		return (CATStatusChangeRCCompleted);
	}

	// ѡȡ�߶β����������ע
	spElementLine1 = spListElem[1];
	spElementLine2 = spListElem[4];
	CATIDrwAnnotationFactory_var piDrwFact = spMainView;
	CreateLineDimension(spElementLine1, spElementLine2, piDrwFact);

	// �ͷ��߶ζ���
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

			// �����ڴ�
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
