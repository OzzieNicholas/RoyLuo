#ifndef CAADrwAddin_H
#define CAADrwAddin_H

#include "CATBaseUnknown.h" 
#include "CATCommandHeader.h"
#include "CATCreateWorkshop.h"
#include "CATCmdContainer.h"
#include "CATCmdStarter.h"

class CATCmdContainer;

class CAADrwAddin : public CATBaseUnknown
{
  CATDeclareClass;

  public:
     CAADrwAddin();
     virtual ~CAADrwAddin();
     void CreateCommands();
     CATCmdContainer * CreateToolbars();

  private:
	CAADrwAddin (CAADrwAddin &);
	CAADrwAddin& operator=(CAADrwAddin&); 

};
#endif
