#include "CAADrwAddin.h"

MacDeclareHeader(CAADrwHeader);

CATImplementClass(CAADrwAddin, DataExtension, CATBaseUnknown, CAADrwAddn);

CAADrwAddin::CAADrwAddin() : CATBaseUnknown() {}

CAADrwAddin::~CAADrwAddin() {}

#include "TIE_CATIDRWFRAMEAddin.h"
TIE_CATIDRWFRAMEAddin(CAADrwAddin);

void CAADrwAddin::CreateCommands() {
  new CAADrwHeader("CenterLine", "CAADrwCenterLine", "CAADrwCenterLineCmd",
                   (void *)NULL);
  new CAADrwHeader("DistanceDim", "CAADrwDistanceDim", "CAADrwDistanceDimCmd",
                   (void *)NULL);
}

CATCmdContainer *CAADrwAddin::CreateToolbars() {
  NewAccess(CATCmdContainer, pCAADrwTlb, CAAUseCaseCommands);

  NewAccess(CATCmdStarter, pCenterLineStr, CenterLineStr);
  SetAccessCommand(pCenterLineStr, "CenterLine");
  SetAccessChild(pCAADrwTlb, pCenterLineStr);

  NewAccess(CATCmdStarter, pDistanceDimStr, DistanceDimStr);
  SetAccessCommand(pDistanceDimStr, "DistanceDim");
  SetAccessNext(pCenterLineStr, pDistanceDimStr);

  AddToolbarView(pCAADrwTlb, -1, UnDock);

  return pCAADrwTlb;
}
