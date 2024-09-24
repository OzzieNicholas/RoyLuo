#ifndef MAINWINDOW_H  // 预处理指令，防止头文件重复包含
#define MAINWINDOW_H  // 定义头文件标识符

#include "primitive.h"  // 包含图元类的头文件
#include <QMainWindow>  // 包含 QMainWindow 类的头文件
#include <QPaintEvent>  // 包含 QPaintEvent 类的头文件
#include <QMouseEvent>  // 包含 QMouseEvent 类的头文件
#include <QDesktopServices>  // 包含 QDesktopServices 类的头文件
#include <QColorDialog>  // 包含 QColorDialog 类的头文件
#include <QFileDialog>  // 包含 QFileDialog 类的头文件
#include <QPainter>  // 包含 QPainter 类的头文件
#include <QBrush>  // 包含 QBrush 类的头文件
#include <QString>  // 包含 QString 类的头文件
#include <QUrl>  // 包含 QUrl 类的头文件

// Ui 命名空间包含用户界面类
namespace Ui {
class MainWindow;  // 声明 MainWindow 类
}

// MainWindow 类继承自 QMainWindow，表示主窗口
class MainWindow : public QMainWindow
{
    Q_OBJECT  // Qt 宏，用于处理信号和槽机制

public:
    // 显式构造函数，参数 parent 表示父窗口，默认值为 nullptr，表示没有父窗口
    explicit MainWindow(QWidget *parent = nullptr);
    // 析构函数，释放资源
    ~MainWindow();

    // 重写的绘制事件，当窗口需要重绘时调用
    void paintEvent(QPaintEvent *event);		
    // 重写的鼠标按下事件，当鼠标按下时调用
    void mousePressEvent(QMouseEvent *event);	
    // 重写的鼠标移动事件，当鼠标移动时调用
    void mouseMoveEvent(QMouseEvent *event);	
    // 重写的鼠标松开事件，当鼠标松开时调用
    void mouseReleaseEvent(QMouseEvent *event);	
    // 重写的窗口调整事件，当窗口大小改变时调用
    void resizeEvent(QResizeEvent *event);		

private slots:
    // 各个菜单项对应的槽函数，用于切换程序状态
    void on_action_open_triggered();        // 打开文件
    void on_action_save_triggered();        // 保存文件
    void on_action_line_triggered();        // 画线
    void on_action_triangle_triggered();    // 画三角形
    void on_action_rectangle_triggered();   // 画矩形
    void on_action_circle_triggered();      // 画圆
    void on_action_ellipse_triggered();     // 画椭圆
    void on_action_polygon_triggered();     // 画多边形
    void on_action_curve_triggered();       // 画曲线
    void on_action_translate_triggered();   // 平移
    void on_action_rotate_triggered();      // 旋转
    void on_action_palette_triggered();     // 调色板
    void on_action_trash_triggered();       // 删除
    void on_action_zoomin_triggered();      // 放大
    void on_action_zoomout_triggered();     // 缩小
    void on_action_clip_triggered();        // 裁剪
    void on_action_addpoint_triggered();    // 添加点
    void on_action_deletepoint_triggered(); // 删除点
    void on_action_help_triggered();        // 帮助

    void on_action_freedraw_triggered();

private:
    Ui::MainWindow *ui;  // 用户界面对象，管理界面组件
    // 程序的状态枚举，表示当前的绘图操作
    enum State {FreeDraw, Line, Triangle, Rectangle, Circle, Ellipse, Polygon, Curve,
                Translate, Rotate, ZoomIn, ZoomOut, Trash} state;
    QVector<QPoint> points;  // 存储鼠标点击的位置
    QList<Primitive *> primitives;  // 已经绘制的图元列表
    Primitive *primitive;  // 当前操作的图元
    QImage image;  // 画布，用于绘制图元
    QPen pen;  // 笔，用于设置点的颜色和大小
    QPainter painter;  // 画笔，用于绘制图元
    QString s;  // 字符串，用于存储一些临时数据
};

#endif // MAINWINDOW_H
