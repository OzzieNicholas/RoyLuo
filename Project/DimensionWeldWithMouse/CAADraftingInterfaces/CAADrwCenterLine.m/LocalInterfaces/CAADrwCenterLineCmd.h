// COPYRIGHT DASSAULT SYSTEMES 2024
//============================================================================================
// Sample code for : Drafting Interfaces
// Mission         : Creates centerLines on interactive and generative circles
//
// Type            : Interactive command
// Inputs          : No input
// Outputs         : No output
// Run command     : Put the command in a test workbench  
//
// Illustrates     : o The center line annotation 
//                   o The annotation factory
//                   o Generative/Interactive geometry 
//============================================================================================


#ifndef CAADrwCenterLineCmd_H
#define CAADrwCenterLineCmd_H

// DialogEngine
#include "CATStateCommand.h"
// System
#include "CATBooleanDef.h"
// Visualization

// DraftingInterface
#include "IDMCircle2D.h"
#include "IDMPoint2D.h"
#include "IDMLine2D.h"
#include "CATIDrwCenterLine.h"
#include "CATIDrwAnnotationFactory.h"


class CATPathElementAgent;

class CAADrwCenterLineCmd : public CATStateCommand
{

public:



	CAADrwCenterLineCmd();
	virtual ~CAADrwCenterLineCmd();

	// Builds th state-chart graph
	// ---------------------------
	void BuildGraph();

	// Creates the ponit to point dim
	// =======================
	boolean ActionTwo(void* iData=NULL);
	boolean ActionOne(void* iData=NULL);
private:

	// The selection agent
	// -------------------
	CATPathElementAgent          *_pObjectAgentA;
	CATPathElementAgent          *_pObjectAgentB;
	IDMCircle2D                    *piElementRefA;
	IDMLine2D                    *piElementRefB;

};

#endif
