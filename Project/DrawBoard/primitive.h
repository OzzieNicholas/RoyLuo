#ifndef PRIMITIVE_H
#define PRIMITIVE_H
#include <QPen>         // 包含 QPen 类，用于定义画笔
#include <QPoint>       // 包含 QPoint 类，用于定义点
#include <QVector>      // 包含 QVector 类，用于定义动态数组
#include <QPainter>     // 包含 QPainter 类，用于绘图
#include <QtMath>       // 包含 QtMath 库，用于数学计算
#include <QtAlgorithms> // 包含 QtAlgorithms 库，用于算法操作
#include <QDebug>       // 包含 QDebug 类，用于调试
#include <functional>   // 包含 C++ 标准库中的功能类，用于函数对象
// Primitive 类用于表示图元，包括直线、多边形、圆形、椭圆和曲线
class Primitive
{
public:
    // 枚举类型，用于表示图元的类型
    enum Type { Line, Polygon, Circle, Ellipse, Curve };
    // 默认构造函数
    Primitive();
    // 构造函数，初始化图元的画笔、类型和参数
    Primitive(QPen pen, Type type, QVector<QPoint> args);
    // 获取图元的画笔
    QPen pen();
    // 判断图元是否包含某点
    bool contain(QPoint p);
    // 获取图元的中心点
    QPoint center() const;
    // 获取图元的类型
    Type type() const;
    // 获取图元的参数
    QVector<QPoint> args() const;
    // 获取图元的所有点
    QVector<QPoint> points() const;
    // 设置图元的参数
    void setArgs(QVector<QPoint> args);
    // 设置图元的所有点
    void setPoints(QVector<QPoint> args);
    // 静态函数，用于绘制直线
    static QVector<QPoint> drawLine(QVector<QPoint> args);
    // 静态函数，用于绘制多边形
    static QVector<QPoint> drawPolygon(QVector<QPoint> args);
    // 静态函数，用于绘制圆形
    static QVector<QPoint> drawCircle(QVector<QPoint> args);
    // 静态函数，用于绘制椭圆
    static QVector<QPoint> drawEllipse(QVector<QPoint> args);
    // 静态函数，用于绘制曲线
    static QVector<QPoint> drawCurve(QVector<QPoint> args);
    // 平移图元
    QVector<QPoint> translate(QPoint pos);
    // 旋转图元
    QVector<QPoint> rotate(qreal r);
    // 缩放图元
    QVector<QPoint> scale(qreal s);

private:
    QPen _pen;                 // 图元的画笔，定义点的颜色和大小
    Type _type;                // 图元的类型
    QPoint _center;            // 图元的中心点，用于旋转和缩放
    QVector<QPoint> _args;     // 图元的参数
    QVector<QPoint> _points;   // 图元的所有点
};
#endif // PRIMITIVE_H
