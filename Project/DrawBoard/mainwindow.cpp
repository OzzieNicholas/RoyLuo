#include "mainwindow.h"
#include "ui_mainwindow.h"

// 构造函数，初始化成员变量
MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow),
    state(FreeDraw),
    primitive(nullptr),
    pen(Qt::black, 3)
{
    ui->setupUi(this);
}


MainWindow::~MainWindow()
{
    // 删除所有绘制的图元
    foreach (Primitive *p, primitives)
        delete p;               // release
    delete ui;
}

// 重写绘制事件，当窗口需要重绘时调用
void MainWindow::paintEvent(QPaintEvent *event)
{
    Q_UNUSED(event)             //avoid warning
    image.fill(Qt::white);
    painter.begin(&image);


    if (!s.isEmpty())
    {
        QImage temp(s);

        painter.drawImage(QPoint((image.width() - temp.width()) / 2, (image.height() - temp.height()) / 2), temp);
    }


    foreach (Primitive *p, primitives)
    {
        painter.setPen(p->pen());
        painter.drawPoints(p->points());
    }


    if (state == Polygon || state == Curve)
    {
        painter.setBrush(QBrush(Qt::black)); // defalt black
        foreach (QPoint p, points)
            painter.drawEllipse(p, 4, 4);
    }


    painter.end();

    ui->label->setPixmap(QPixmap::fromImage(image)); 

}


void MainWindow::mousePressEvent(QMouseEvent *event)
{
    QPoint pos = event->pos();
    pos.rx() -= 11;
    pos.ry() -= 51;

    if (state == FreeDraw)
    {
        points.clear();
        points.append(pos);
        primitive = new Primitive(pen, Primitive::Curve, points);
        primitives.append(primitive);
    }
    else {
        points.append(pos);

        switch (state)
        {
        case Line:
            primitive = new Primitive(pen, Primitive::Line, {pos, pos});
            primitives.append(primitive);
            break;
        case Triangle:
            primitive = new Primitive(pen, Primitive::Polygon, {pos, pos, pos});
            primitives.append(primitive);
            break;
        case Rectangle:
            primitive = new Primitive(pen, Primitive::Polygon, {pos, pos, pos, pos});
            primitives.append(primitive);
            break;
        case Circle:
            primitive = new Primitive(pen, Primitive::Circle, {pos, QPoint(0, 0)});
            primitives.append(primitive);
            break;
        case Ellipse:
            primitive = new Primitive(pen, Primitive::Ellipse, {pos, QPoint(0, 0)});
            primitives.append(primitive);
            break;
        case Polygon:
        case Curve:
            break;
        case Translate:
        case Rotate:
        case ZoomIn:
        case ZoomOut:
        case Trash:
            primitive = nullptr;


            foreach (Primitive *p, primitives)
                if (p->contain(points[0]))
                {
                    primitive = p;
                    break;
                }
            break;
        }
    }

    update();
}


void MainWindow::mouseMoveEvent(QMouseEvent *event)
{
    QPoint pos = event->pos();
    pos.rx() -= 11;
    pos.ry() -= 51;
    
    if (state == FreeDraw && !points.isEmpty()) {
        points.append(pos);
        primitive->setArgs(points);
    }
    else {
        QVector<QPoint> args;
        switch (state)
        {
        case Line:
            primitive->setArgs({points[0], pos});
            break;
        case Triangle:
            primitive->setArgs({pos,
                                {(points[0].x() + pos.x()) / 2, points[0].y()},
                                {points[0].x(), pos.y()}});
            break;
        case Rectangle:
            primitive->setArgs({points[0],
                                {points[0].x(), pos.y()},
                                pos,
                                {pos.x(), points[0].y()}});
            break;
        case Circle:

            if (qAbs(pos.x() - points[0].x()) < qAbs(pos.y() - points[0].y()))
                if (pos.ry() > points[0].y())
                    pos.ry() = points[0].y() + qAbs(pos.rx() - points[0].x());
                else
                    pos.ry() = points[0].y() - qAbs(pos.rx() - points[0].x());
            else
                if (pos.rx() > points[0].x())
                    pos.rx() = points[0].x() + qAbs(pos.ry() - points[0].y());
                else
                    pos.rx() = points[0].x() - qAbs(pos.ry() - points[0].y());
            primitive->setArgs({(pos + points[0]) / 2,
                                (pos - points[0]) / 2});
            break;
        case Ellipse:
            primitive->setArgs({(pos + points[0]) / 2,
                                (pos - points[0]) / 2});
            break;
        case Polygon:
        case Curve:
        case ZoomIn:
        case ZoomOut:
        case Trash:
            break;
        case Translate:
            if (!primitive)
                break;
            args = primitive->translate(pos - points[0]);
            primitive->setPoints(args);
            break;

        case Rotate:
            if (!primitive)
                break;
            QPoint a = points[0] - primitive->center(),
                b = pos - primitive->center();
            qreal product = a.x() * b.y() - a.y() * b.x();
            qreal aNorm = qSqrt(qreal(a.x() * a.x() + a.y() * a.y()));
            qreal bNorm = qSqrt(qreal(b.x() * b.x() + b.y() * b.y()));
            args = primitive->rotate(qAsin(product / aNorm / bNorm));
            primitive->setPoints(args);
            break;
        }
    }
    update();
}


void MainWindow::mouseReleaseEvent(QMouseEvent *event)
{
    QPoint pos = event->pos();
    pos.rx() -= 11;
    pos.ry() -= 51;
    QVector<QPoint> args;

    switch (state)
    {
    case FreeDraw:
        points.append(pos);
        primitive->setArgs(points);
        points.clear();
        break;
    case Line:
        primitive->setArgs({points[0], pos});
        break;
    case Triangle:
        primitive->setArgs({pos,
                            {(points[0].x() + pos.x()) / 2, points[0].y()},
                            {points[0].x(), pos.y()}});
        break;
    case Rectangle:
        primitive->setArgs({points[0],
                            {points[0].x(), pos.y()},
                            pos,
                            {pos.x(), points[0].y()}});
        break;
    case Circle:
        if (qAbs(pos.x() - points[0].x()) < qAbs(pos.y() - points[0].y()))
            if (pos.ry() > points[0].y())
                pos.ry() = points[0].y() + qAbs(pos.rx() - points[0].x());
            else
                pos.ry() = points[0].y() - qAbs(pos.rx() - points[0].x());
        else
            if (pos.rx() > points[0].x())
                pos.rx() = points[0].x() + qAbs(pos.ry() - points[0].y());
            else
                pos.rx() = points[0].x() - qAbs(pos.ry() - points[0].y());
        primitive->setArgs({(pos + points[0]) / 2,
                            (pos - points[0]) / 2});
        break;
    case Ellipse:
        primitive->setArgs({(pos + points[0]) / 2,
                            (pos - points[0]) / 2});
        break;
    case Polygon:
        primitive->setArgs(points);
        break;
    case Curve:
        primitive->setArgs(points);
        break;
    case Translate:
        if (!primitive)
            break;
        args = primitive->translate(pos - points[0]);
        primitive->setArgs(args);
        break;

    case ZoomIn:                        // 如果状态是放大
        if (!primitive)
            break;
        args = primitive->scale(1.1);   // 放大图元，缩放因子为 1.1
        primitive->setArgs(args);       // 设置图元的新位置
        break;
    case ZoomOut:                       // 如果状态是缩小
        if (!primitive)
            break;
        args = primitive->scale(0.9);   // 缩小图元，缩放因子为 0.9
        primitive->setArgs(args);       // 设置图元的新位置
        break;
    case Trash:                         // 如果状态是删除
        primitives.removeAll(primitive); // 从图元列表中删除当前图元
        delete primitive;               // 删除当前图元
        break;
    case Rotate:                        // 如果状态是旋转
        if (!primitive)
            break;
        // 计算旋转的角度和新的位置
        QPoint a = points[0] - primitive->center(), b = pos - primitive->center(); // 获取旋转前后的矢量
        qreal product = a.x() * b.y() - a.y() * b.x();  // 计算叉积
        qreal aNorm = qSqrt(qreal(a.x() * a.x() + a.y() * a.y())); // 计算 a 的模长
        qreal bNorm = qSqrt(qreal(b.x() * b.x() + b.y() * b.y())); // 计算 b 的模长
        args = primitive->rotate(qAsin(product / aNorm / bNorm)); // 旋转图元，计算旋转后的新位置
        primitive->setArgs(args);      // 设置图元的新位置
        break;
    }
    update(); // 更新界面，调用 QWidget 的 update() 函数触发 paintEvent
    if (state != Curve && state != Polygon && state != FreeDraw)
        points.clear(); // 清空点列表，除非当前状态是画曲线或多边形
}

// 重写窗口调整大小事件，当窗口大小改变时调用
void MainWindow::resizeEvent(QResizeEvent *event)
{
    Q_UNUSED(event) // 忽略未使用的参数 event，避免编译器警告
    // 调整标签大小，ui->label 是一个 QLabel 对象，ui->centralWidget 是中央部件
    ui->label->resize(ui->centralWidget->size() - QSize(22, 22));
    // 创建新的画布，image 是 QImage 类型，QImage::Format_RGB32 指定图像格式为 RGB32
    image = QImage(ui->label->size(), QImage::Format_RGB32);
}

// 打开文件槽函数，响应打开文件的菜单项
void MainWindow::on_action_open_triggered()
{
    // 打开文件对话框，获取用户选择的文件路径，并将其赋值给 s，s 是 QString 类型
    s = (QFileDialog::getOpenFileName(this, QString(), QString(), "Image Files(*.bmp *.jpg *.png)"));
}

// 保存文件槽函数，响应保存文件的菜单项
void MainWindow::on_action_save_triggered()
{
    // 打开保存文件对话框，将当前画布保存为用户指定的文件
    image.save(QFileDialog::getSaveFileName(this, QString(), QString(), "Image Files(*.bmp *.jpg *.png)"));
}

// 切换到画线状态槽函数，响应画线菜单项
void MainWindow::on_action_line_triggered()
{
    state = Line; // 将当前状态设置为 Line，即画线
    points.clear(); // 清空点列表
}

// 切换到画三角形状态槽函数，响应画三角形菜单项
void MainWindow::on_action_triangle_triggered()
{
    state = Triangle; // 将当前状态设置为 Triangle，即画三角形
    points.clear(); // 清空点列表
}

// 切换到画矩形状态槽函数，响应画矩形菜单项
void MainWindow::on_action_rectangle_triggered()
{
    state = Rectangle; // 将当前状态设置为 Rectangle，即画矩形
    points.clear(); // 清空点列表
}

// 切换到画圆状态槽函数，响应画圆菜单项
void MainWindow::on_action_circle_triggered()
{
    state = Circle; // 将当前状态设置为 Circle，即画圆
    points.clear(); // 清空点列表
}

// 切换到画椭圆状态槽函数，响应画椭圆菜单项
void MainWindow::on_action_ellipse_triggered()
{
    state = Ellipse; // 将当前状态设置为 Ellipse，即画椭圆
    points.clear(); // 清空点列表
}

// 切换到画多边形状态槽函数，响应画多边形菜单项
void MainWindow::on_action_polygon_triggered()
{
    state = Polygon; // 将当前状态设置为 Polygon，即画多边形
    points.clear(); // 清空点列表
    // 创建新的多边形图元，primitive 是 Primitive 类型的指针
    primitive = new Primitive(pen, Primitive::Polygon, points);
    primitives.append(primitive); // 将新创建的多边形图元添加到图元列表 primitives 中
}

// 切换到画曲线状态槽函数，响应画曲线菜单项
void MainWindow::on_action_curve_triggered()
{
    state = Curve; // 将当前状态设置为 Curve，即画曲线
    points.clear(); // 清空点列表
    // 创建新的曲线图元
    primitive = new Primitive(pen, Primitive::Curve, points);
    primitives.append(primitive); // 将新创建的曲线图元添加到图元列表 primitives 中
}

// 切换到平移状态槽函数，当用户选择平移工具时调用
void MainWindow::on_action_translate_triggered()
{
    state = Translate;  // 将当前状态设置为 Translate（平移）
    points.clear();  // 清空点列表
}

// 切换到旋转状态槽函数，当用户选择旋转工具时调用
void MainWindow::on_action_rotate_triggered()
{
    state = Rotate;  // 将当前状态设置为 Rotate（旋转）
    points.clear();  // 清空点列表
}

// 打开调色板对话框槽函数，当用户选择调色板工具时调用
void MainWindow::on_action_palette_triggered()
{
    // 打开颜色选择对话框，让用户选择一个颜色，并设置画笔颜色为用户选择的颜色
    pen.setColor(QColorDialog::getColor(pen.color(), this));
}

// 切换到删除状态槽函数，当用户选择删除工具时调用
void MainWindow::on_action_trash_triggered()
{
    state = Trash;  // 将当前状态设置为 Trash（删除）
    points.clear();  // 清空点列表
}

// 切换到放大状态槽函数，当用户选择放大工具时调用
void MainWindow::on_action_zoomin_triggered()
{
    state = ZoomIn;  // 将当前状态设置为 ZoomIn（放大）
    points.clear();  // 清空点列表
}

// 切换到缩小状态槽函数，当用户选择缩小工具时调用
void MainWindow::on_action_zoomout_triggered()
{
    state = ZoomOut;  // 将当前状态设置为 ZoomOut（缩小）
    points.clear();  // 清空点列表
}


// 增加画笔宽度槽函数，当用户选择增加画笔宽度工具时调用
void MainWindow::on_action_addpoint_triggered()
{
    pen.setWidth(pen.width() + 1);  // 增加画笔宽度
}

// 减少画笔宽度槽函数，当用户选择减少画笔宽度工具时调用
void MainWindow::on_action_deletepoint_triggered()
{
    if (pen.width() > 1)  // 检查画笔宽度是否大于 1
        pen.setWidth(pen.width() - 1);  // 减少画笔宽度
}


void MainWindow::on_action_freedraw_triggered()
{
    state = FreeDraw;  // 将当前状态设置为 Translate（平移）
    points.clear();  // 清空点列表
}
