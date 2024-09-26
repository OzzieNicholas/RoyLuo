#ifdef LOCAL_DEFINITION_FOR_IID
LINK_WITH_FOR_IID = \
CATDfiUUID \
SketcherInterfacesUUID \

#else
LINK_WITH_FOR_IID = SystemUUID
#endif
# COPYRIGHT DASSAULT SYSTEMES 2000
BUILT_OBJECT_TYPE = SHARED LIBRARY

LINK_WITH=$(LINK_WITH_FOR_IID) \
            CATDialogEngine \
            CATDraftingInterfaces  \
            CATSketcherInterfaces  \
            CATVisualization  CATViz   \
            JS0CORBA JS0FM JS0GROUP \
            CATObjectModelerBase \
            CATObjectSpecsModeler \
            CATMathematics \
            CATApplicationFrame \
            CATCGMGeoMath 