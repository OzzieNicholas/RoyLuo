#ifndef CAADrwDistanceDimCmd_H
#define CAADrwDistanceDimCmd_H
// Mathematic constants
#include "CATMathDef.h"
// System
#include "CATBody.h"
#include "CATCell.h"
#include "CATErrorDef.h"
#include "CATIStringList.h"
#include "CATIUnknownList.h"
#include "CATIUnknownListImpl.h"
#include "CATLib.h"
#include "CATUnicodeString.h"
#include "IUnknown.h"
#include "CATCommand.h"
// CATApplicationFrame
#include "CATFrmEditor.h"
// ObjectSpecsModeler
#include "CATCreateExternalObject.h"
#include "CATIDescendants.h"
#include "CATISpecObject.h"
// ObjectModelerBase
#include "CATDocument.h"
#include "CATDocumentServices.h"
#include "CATIAlias.h"
#include "CATIContainer.h"
#include "CATSessionServices.h"
// Visualization
#include "CATPathElement.h"
#include "CATPathElementAgent.h"
#include "CATSO.h"
// SketcherInterfaces
#include "CATI2DWFGeometry.h"
#include "IDMLine2D.h"
#include "IDMPoint2D.h"
#include "IDMCircle2D.h"
#include "IDMCurve2D.h"
#include "IDMEllipse2D.h"
#include "IDMLine2D.h"
#include "IDMPolyline2D.h"
// DraftingInterfaces
#include "CATCrvEvalLocal.h"
#include "CATCrvParam.h"
#include "CATCurve.h"
#include "CATDimDefinition.h"
#include "CATDrwUtility.h"
#include "CATIDftDocumentServices.h"
#include "CATIDftDrawing.h"
#include "CATIDftGenGeom.h"
#include "CATIDftGenGeomAccess.h"
#include "CATIDftGenView.h"
#include "CATIDftHatchingPattern.h"
#include "CATIDftSheet.h"
#include "CATIDftStandardManager.h"
#include "CATIDftView.h"
#include "CATIDrwAnnotationFactory.h"
#include "CATIDrwBreakElem.h"
#include "CATIDrwBreakElemFactory.h"
#include "CATIDrwFactory.h"
#include "CATISheet.h"
#include "CATIView.h"
#include "CATPoint.h"
#include "CATI2DPoint.h"
// Miscellaneous
#include "CATIProduct.h"
#include "CATIBRepAccess.h"
#include "CATMfBRepDecode.h"
#include "iostream.h"
#include "float.h"

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
	// 获取投影零件的名称，获取投影几何体的名称
	CATUnicodeString CAADrwDistanceDimCmd::GetParentBodyAndPart(IUnknown *pItem);

};

#endif
