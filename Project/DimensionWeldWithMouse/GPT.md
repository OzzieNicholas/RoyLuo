## 标注焊接尺寸

![image-20240903151808424](C:/Users/yi.luo.EDRAWING/AppData/Roaming/Typora/typora-user-images/image-20240903151808424.png)

```
开发背景：CATIAV5R19，VS2005，CAA
项目需求：对于工程图，计算所有body两两之间的XYZ三个方向的距离
需求说明：如图所示是三维的零件在工程图的投影结果，我现在想得到的是，两个body之间在XYZ三个方向的最小距离信息，我认为可行的方法是：
（1）计算不同视图的边界距离作为最小距离:
对于正视图，计算两个 body 的最左边界之间的距离，这代表两个 body 在 X 方向上的最小距离；
对于俯视图，计算两个 body 的最下边界之间的距离，这代表两个 body 在 Y 方向上的最小距离；
对于侧视图，计算两个 body 的最下边界之间的距离，这代表两个 body 在 Z 方向上的最小距离；
（2）整合信息:
将从三个视图中提取的 X、Y、Z 方向上的距离信息进行整合，以获得两个 body 之间完整的三维距离。

另外，我想问：
（1）CATIA的工程图投影是正交投影视图吗？
（2）我知道，在两个body表面平行的情况下，算边界点的距离就是平面的距离，但我现在不需要考虑那么多特殊情况，直接算边界点的距离，在这种简化需求的情况下，我要求的是XYZ三个方向的最小距离，那么这个方案是对的吗

请你先记忆并分析上述的方案是否正确，尤其是第1点的想法，有没有想错（用中文回答）
```

```
以下是我目前的代码（只算了当前视图的所有body之间最左边界的距离）：

我要实现的完整的功能是：
（1）计算不同视图的边界距离作为最小距离:
对于正视图，计算两个 body 的最左边界之间的距离，这代表两个 body 在 X 方向上的最小距离；
对于俯视图，计算两个 body 的最下边界之间的距离，这代表两个 body 在 Y 方向上的最小距离；
对于侧视图，计算两个 body 的最下边界之间的距离，这代表两个 body 在 Z 方向上的最小距离；
（2）整合信息:
将从三个视图中提取的 X、Y、Z 方向上的距离信息进行整合，以获得两个 body 之间完整的三维距离。

结合我之前给出的GetAllViews函数，以及两份CAA文档，分析我们应该怎么修改代码（暂时不用写代码，而是讨论，应该怎么修改）
```

```
目前我将代码修改为了：

请你检查代码，分析这是否完善
注意：编译器是VS2005，C++语法要匹配
```

```
我们先只针对正视图来修改，你说的对，当前的代码只处理了一个主body和一个副body，我想实现：对于当前的所有遍历到的body，都存储不同body之间的最左边界的距离，我该怎么修改代码呢，注意：编译器是VS2005，C++语法要匹配
```

```
工程图中有多个视图，并且：

对于正视图，计算两个 body 的最左边界之间的距离，这代表两个 body 在 X 方向上的最小距离；
对于俯视图，计算两个 body 的最下边界之间的距离，这代表两个 body 在 Y 方向上的最小距离；
对于侧视图，计算两个 body 的最下边界之间的距离，这代表两个 body 在 Z 方向上的最小距离；

我该怎么修改代码呢，注意：编译器是VS2005，C++语法要匹配
```

```cpp
//提取指定sheet中的所有视图
CATLISTP(IUnknown) GetAllViews(const CATIDftSheet* piSheet) {

	CATIUnknownList* piListOfViewMU = NULL;
	if(FAILED(piSheet->GetViewMakeUps(&piListOfViewMU)))
		return NULL;

	CATLISTP(IUnknown) listViews;
	unsigned int viewMUNumber = 0;
	piListOfViewMU->Count(&viewMUNumber);
	IUnknown* item = NULL;
	CATIDftViewMakeUp* piViewMakeUp;
	CATIView* piView = NULL;
	CATIDftView* piDftView = NULL;

	for(unsigned int i = 0; i < viewMUNumber; i++){
		if(SUCCEEDED(piListOfViewMU->Item(i, &item))){
			piViewMakeUp = (CATIDftViewMakeUp*)item;
			if(NULL != piViewMakeUp) {
				piViewMakeUp->GetView(&piView);
				if(NULL != piView) {
					if(SUCCEEDED(piView->QueryInterface(IID_CATIDftView, (void**)&piDftView)))
						listViews.Append(piDftView);
					piView->Release();
					piView = NULL;	
				}
			}
		}
	}

	return listViews;
}
```

```
先看两个CAA文档，待会儿我们会用到：

DraftingInterfaces Interface CATIDftView
System.IUnknown
  |
  +---System.IDispatch
    |
    +---System.CATBaseUnknown
      |
      +---CATIDftView
 
Usage: an implementation of this interface is supplied and you must use it as is. You should not reimplement it.

interface CATIDftView

Interface of the drawing view object.
Role: The view is a workspace containing geometries and annotations. The view may also contain the generative drafting results. The view positionning in a sheet is managed using the view make-up object. The generative drafting specifications are available using the CATIGenerSpec interface.

See also:
CATIDftViewMakeUp
See also:
CATIGenerSpec
Method Index

o Activate()
Used to Activate the view.
o AddApplicativeExtension(IID&,IUnknown**)
Adds an extension to the view to deal with a specific applicative behavior.
o GetApplicativeExtension(IID&,IUnknown**)
Returns the extension of the view which deals with a specific applicative behavior.
o GetComponents(IID,CATIUnknownList**)
Used to get the view components (annotations, geometry, callout, .
o GetGenerSpec(CATIGenerSpec**)
Gets the generative specifications of the view.
o GetViewName(wchar_t**)
Gets the view name as a string.
o GetViewNameFormula(IUnknown**)
Gets the view name formula.
o GetViewType(CATDftViewType*)
Gets the view type.
o IsActive(boolean*)
Used to know if this view is active.
o SetViewName(wchar_t*)
Sets the view name as a string.
Methods

o Activate
public virtual HRESULT Activate(	)const = 0
Used to Activate the view. The active view is the view in edition. There is only one active view per sheet in a Drawing.
Returns:
HRESULT
S_OK
View is activated.
E_FAIL
View isn't activated.
o AddApplicativeExtension
public virtual HRESULT AddApplicativeExtension(	const IID&	interfaceID,
IUnknown**	oExtension) = 0
Adds an extension to the view to deal with a specific applicative behavior.
Parameters:
interfaceID
The interface which describe the extension to be added
oExtension
The added extension. If the extension already exists, it is returned also
Returns:
HRESULT
S_OK
Execution successfully.
E_UNEXPECTED
f internal problem.
E_INVALIDARG
if not recognize interfaceID.
E_FAIL
Execution failed.
o GetApplicativeExtension
public virtual HRESULT GetApplicativeExtension(	const IID&	interfaceID,
IUnknown**	oExtension) = 0
Returns the extension of the view which deals with a specific applicative behavior.
Parameters:
interfaceID
The interface which describes the extension.
oExtension
The result of the query
Returns:
HRESULT
S_OK
Execution successfully.
E_UNEXPECTED
f internal problem.
E_INVALIDARG
if not recognize interfaceID.
E_FAIL
Execution failed.
o GetComponents
public virtual HRESULT GetComponents(	const IID	interfaceID,
CATIUnknownList**	oElems) const = 0
Used to get the view components (annotations, geometry, callout, ...).
Parameters:
IID
The interface filter.
oElems
List of elements found.
Returns:
HRESULT
S_OK
Elements found
E_FAIL
Execution failed.
o GetGenerSpec
public virtual HRESULT GetGenerSpec(	CATIGenerSpec**	oGenerSpec) const = 0
Gets the generative specifications of the view.
Postcondition: Don't forget to RELEASE the resulting oProduct after use.
Parameters:
oGenerSpec
The generative specification interface.
Returns:
HRESULT
S_OK
Execution successfully.
E_FAIL
Execution failed.
o GetViewName
public virtual HRESULT GetViewName(	wchar_t**	oName) const = 0
Gets the view name as a string.
Parameters:
oName
The view name
Returns:
HRESULT
S_OK
View name has been found
E_FAIL
No view name found.
o GetViewNameFormula
public virtual HRESULT GetViewNameFormula(	IUnknown**	oVNameFormula) const = 0
Gets the view name formula. This object is a CKE formula computing the view name. from different inputs.
Parameters:
oVNameFormula
The view name formula
Returns:
HRESULT
S_OK
View name formula has been modified
E_FAIL
No view name formula found.
o GetViewType
public virtual HRESULT GetViewType(	CATDftViewType*	oType) const = 0
Gets the view type.
Parameters:
oType
The view type
Returns:
HRESULT
S_OK
View type has been found
E_FAIL
No view type found.
o IsActive
public virtual HRESULT IsActive(	boolean*	oActive) const = 0
Used to know if this view is active. The active view is the view in edition. There is only one active view int the drawing.
Parameters:
oActive
TRUE if the view is active.
Returns:
HRESULT
S_OK
Execution successfully.
E_FAIL
Execution failed.
o SetViewName
public virtual HRESULT SetViewName(	const wchar_t*	iName) = 0
Sets the view name as a string. This name can override an existing formula.
Parameters:
iName
The view name
Returns:
HRESULT
S_OK
View name has been modified
E_FAIL
No modification applied.
This object is included in the file: CATIDftView.h
If needed, your Imakefile.mk should include the module: CATDraftingInterfaces
```

```
DraftingInterfaces Enumeration CATDftViewType
enum CATDftViewType {
  DftBackgroundView,
  DftFrontView,
  DftLeftView,
  DftRightView,
  DftTopView,
  DftBottomView,
  DftRearView,
  DftAuxiliaryView,
  DftIsomView,
  DftSectionView,
  DftSectionCutView,
  DftDetailView,
  DftUntypedView,
  DftMainView,
  DftPureSketch,
  DftUnfoldedView
}
Type of a view.
Values:
DftBackgroundView
The background view is the view in the background of the sheet This view contains in general the frames and title blocks. There is a background view per sheet.
DftFrontView
The front view is a front representation of a part.
DftLeftView
The left view is a left representation of a part regarding to the current standard.
DftRightView
The right view is a right representation of a part regarding to the current standard.
DftTopView
The top view is a top representation of a part regarding to the current standard.
DftBottomView
The bottom view is a bottom representation of a part regarding to the current standard.
DftRearView
The rear view is a rear representation of a part regarding to the current standard.
DftAuxiliaryView
The auxiliary view is a representation of a part regarding to an user defined projection plane
DftIsomView
The isom view is a isometric view of a part.
DftSectionView
The section view is a view of a part which is first sectionned regarding to a user defined profile. The part geometry beside the section plane is visible.
DftSectionCutView
The section cut view is a view of a part which is first sectionned regarding to a user defined profile. Only the geometry in the section plane is visible.
DftDetailView
The detail view is a view of a local area of the part. The area boundarie may be a circle or a polyline.
DftUntypedView
The untyped view is none of those typed views.
DftMainView
The main view is the view suporting geometries and annotations for a sheet. In other words, the main view is the default view of a sheet. There is a main view per sheet.
DftPureSketch
The pure sketch is for internal uses only.
DftUnfoldedView
To specify an unfolded view of a part.
This object is included in the file: CATDftViewType.h
```





