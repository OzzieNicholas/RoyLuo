#include "CAADrwAddin.h"

#include "CATCommandHeader.h"
#include "CATCreateWorkshop.h"

#include "CATCmdContainer.h"
#include "CATCmdStarter.h"

MacDeclareHeader(CAADrwHeader);

CATImplementClass( CAADrwAddin,
                   DataExtension,
                   CATBaseUnknown,
                   CAADrwAddn);

//-----------------------------------------------------------------------------
// CAADrwAddin : constructor and destructor
//-----------------------------------------------------------------------------
CAADrwAddin::CAADrwAddin():
    CATBaseUnknown()
{
}

CAADrwAddin::~CAADrwAddin()
{
}

//----------------------------------------------------------------------------- 
// Tie the implementation to its interface
// ----------------------------------------------------------------------------
#include "TIE_CATIDRWFRAMEAddin.h"
TIE_CATIDRWFRAMEAddin(CAADrwAddin);

//----------------------------------------------------
// Implements CATIDRWFRAMEAddin::CreateCommands
//----------------------------------------------------
void CAADrwAddin::CreateCommands()
{

	new CAADrwHeader("CenterLine","CAADrwCenterLine",
					 "CAADrwCenterLineCmd",(void *)NULL);
	new CAADrwHeader("DistanceDim","CAADrwDistanceDim",
					 "CAADrwDistanceDimCmd",(void *)NULL);

}

//-----------------------------------------------------
// Implements CATIDRWFRAMEAddin::CreateToolbars
//-----------------------------------------------------
CATCmdContainer *CAADrwAddin::CreateToolbars()
{
    NewAccess        (CATCmdContainer, pCAADrwTlb,    CAAUseCaseCommands );
        


    NewAccess        (CATCmdStarter    , pCenterLineStr , CenterLineStr );
    SetAccessCommand (pCenterLineStr    , "CenterLine" );
    SetAccessChild    (pCAADrwTlb , pCenterLineStr  );

	NewAccess        (CATCmdStarter    , pDistanceDimStr , DistanceDimStr );
    SetAccessCommand (pDistanceDimStr    , "DistanceDim" );
    SetAccessNext    (pCenterLineStr , pDistanceDimStr  );


	
    AddToolbarView   (pCAADrwTlb , -1 , UnDock); 

    return pCAADrwTlb;
}
