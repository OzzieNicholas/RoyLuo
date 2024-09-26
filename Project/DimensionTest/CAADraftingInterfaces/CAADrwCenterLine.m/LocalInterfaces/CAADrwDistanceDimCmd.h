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

	virtual CATStatusChangeRC Activate(
		CATCommand * iFromClient,
		CATNotification * iEvtDat);

	virtual CATStatusChangeRC Desactivate(
		CATCommand * iFromClient,
		CATNotification * iEvtDat);

	virtual CATStatusChangeRC Cancel(
		CATCommand * iFromClient,
		CATNotification * iEvtDat);

private:
	IDMLine2D_var spElementLine1;
	IDMLine2D_var spElementLine2;
	void CreateLineDimension(IDMLine2D_var spLine1, IDMLine2D_var spLine2, CATIDrwAnnotationFactory_var piDrwFact);
};

#endif
