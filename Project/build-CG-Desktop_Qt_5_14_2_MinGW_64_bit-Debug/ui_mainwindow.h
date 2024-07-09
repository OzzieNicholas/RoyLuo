/********************************************************************************
** Form generated from reading UI file 'mainwindow.ui'
**
** Created by: Qt User Interface Compiler version 5.14.2
**
** WARNING! All changes made in this file will be lost when recompiling UI file!
********************************************************************************/

#ifndef UI_MAINWINDOW_H
#define UI_MAINWINDOW_H

#include <QtCore/QVariant>
#include <QtWidgets/QAction>
#include <QtWidgets/QApplication>
#include <QtWidgets/QLabel>
#include <QtWidgets/QMainWindow>
#include <QtWidgets/QMenuBar>
#include <QtWidgets/QToolBar>
#include <QtWidgets/QWidget>

QT_BEGIN_NAMESPACE

class Ui_MainWindow
{
public:
    QAction *action_line;
    QAction *action_triangle;
    QAction *action_rectangle;
    QAction *action_circle;
    QAction *action_ellipse;
    QAction *action_polygon;
    QAction *action_palette;
    QAction *action_translate;
    QAction *action_trash;
    QAction *action_rotate;
    QAction *action_zoomin;
    QAction *action_zoomout;
    QAction *action_save;
    QAction *action_open;
    QAction *action_clip;
    QAction *action_curve;
    QAction *action_addpoint;
    QAction *action_deletepoint;
    QAction *action_help;
    QWidget *centralWidget;
    QLabel *label;
    QMenuBar *menuBar;
    QToolBar *mainToolBar;

    void setupUi(QMainWindow *MainWindow)
    {
        if (MainWindow->objectName().isEmpty())
            MainWindow->setObjectName(QString::fromUtf8("MainWindow"));
        MainWindow->resize(800, 600);
        MainWindow->setStyleSheet(QString::fromUtf8(""));
        action_line = new QAction(MainWindow);
        action_line->setObjectName(QString::fromUtf8("action_line"));
        action_line->setEnabled(true);
        QIcon icon;
        icon.addFile(QString::fromUtf8(":/rc/Line.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_line->setIcon(icon);
        action_triangle = new QAction(MainWindow);
        action_triangle->setObjectName(QString::fromUtf8("action_triangle"));
        QIcon icon1;
        icon1.addFile(QString::fromUtf8(":/rc/Triangle.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_triangle->setIcon(icon1);
        action_rectangle = new QAction(MainWindow);
        action_rectangle->setObjectName(QString::fromUtf8("action_rectangle"));
        QIcon icon2;
        icon2.addFile(QString::fromUtf8(":/rc/Rectangle.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_rectangle->setIcon(icon2);
        action_circle = new QAction(MainWindow);
        action_circle->setObjectName(QString::fromUtf8("action_circle"));
        QIcon icon3;
        icon3.addFile(QString::fromUtf8(":/rc/Circle.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_circle->setIcon(icon3);
        action_ellipse = new QAction(MainWindow);
        action_ellipse->setObjectName(QString::fromUtf8("action_ellipse"));
        QIcon icon4;
        icon4.addFile(QString::fromUtf8(":/rc/Ellipse.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_ellipse->setIcon(icon4);
        action_polygon = new QAction(MainWindow);
        action_polygon->setObjectName(QString::fromUtf8("action_polygon"));
        QIcon icon5;
        icon5.addFile(QString::fromUtf8(":/rc/Octagon.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_polygon->setIcon(icon5);
        action_palette = new QAction(MainWindow);
        action_palette->setObjectName(QString::fromUtf8("action_palette"));
        QIcon icon6;
        icon6.addFile(QString::fromUtf8(":/rc/Palette.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_palette->setIcon(icon6);
        action_translate = new QAction(MainWindow);
        action_translate->setObjectName(QString::fromUtf8("action_translate"));
        QIcon icon7;
        icon7.addFile(QString::fromUtf8(":/rc/Translate.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_translate->setIcon(icon7);
        action_trash = new QAction(MainWindow);
        action_trash->setObjectName(QString::fromUtf8("action_trash"));
        QIcon icon8;
        icon8.addFile(QString::fromUtf8(":/rc/Trash.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_trash->setIcon(icon8);
        action_rotate = new QAction(MainWindow);
        action_rotate->setObjectName(QString::fromUtf8("action_rotate"));
        QIcon icon9;
        icon9.addFile(QString::fromUtf8(":/rc/Rotate.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_rotate->setIcon(icon9);
        action_zoomin = new QAction(MainWindow);
        action_zoomin->setObjectName(QString::fromUtf8("action_zoomin"));
        QIcon icon10;
        icon10.addFile(QString::fromUtf8(":/rc/ZoomIn.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_zoomin->setIcon(icon10);
        action_zoomout = new QAction(MainWindow);
        action_zoomout->setObjectName(QString::fromUtf8("action_zoomout"));
        QIcon icon11;
        icon11.addFile(QString::fromUtf8(":/rc/ZoomOut.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_zoomout->setIcon(icon11);
        action_save = new QAction(MainWindow);
        action_save->setObjectName(QString::fromUtf8("action_save"));
        QIcon icon12;
        icon12.addFile(QString::fromUtf8(":/rc/Save.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_save->setIcon(icon12);
        action_open = new QAction(MainWindow);
        action_open->setObjectName(QString::fromUtf8("action_open"));
        QIcon icon13;
        icon13.addFile(QString::fromUtf8(":/rc/Open.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_open->setIcon(icon13);
        action_clip = new QAction(MainWindow);
        action_clip->setObjectName(QString::fromUtf8("action_clip"));
        QIcon icon14;
        icon14.addFile(QString::fromUtf8(":/rc/Clip.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_clip->setIcon(icon14);
        action_curve = new QAction(MainWindow);
        action_curve->setObjectName(QString::fromUtf8("action_curve"));
        QIcon icon15;
        icon15.addFile(QString::fromUtf8(":/rc/Curve.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_curve->setIcon(icon15);
        action_addpoint = new QAction(MainWindow);
        action_addpoint->setObjectName(QString::fromUtf8("action_addpoint"));
        QIcon icon16;
        icon16.addFile(QString::fromUtf8(":/rc/AddPoint.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_addpoint->setIcon(icon16);
        action_deletepoint = new QAction(MainWindow);
        action_deletepoint->setObjectName(QString::fromUtf8("action_deletepoint"));
        QIcon icon17;
        icon17.addFile(QString::fromUtf8(":/rc/DeletePoint.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_deletepoint->setIcon(icon17);
        action_help = new QAction(MainWindow);
        action_help->setObjectName(QString::fromUtf8("action_help"));
        QIcon icon18;
        icon18.addFile(QString::fromUtf8(":/rc/Help.png"), QSize(), QIcon::Normal, QIcon::Off);
        action_help->setIcon(icon18);
        centralWidget = new QWidget(MainWindow);
        centralWidget->setObjectName(QString::fromUtf8("centralWidget"));
        centralWidget->setStyleSheet(QString::fromUtf8(""));
        label = new QLabel(centralWidget);
        label->setObjectName(QString::fromUtf8("label"));
        label->setGeometry(QRect(11, 11, 778, 487));
        MainWindow->setCentralWidget(centralWidget);
        menuBar = new QMenuBar(MainWindow);
        menuBar->setObjectName(QString::fromUtf8("menuBar"));
        menuBar->setGeometry(QRect(0, 0, 800, 23));
        menuBar->setStyleSheet(QString::fromUtf8(""));
        MainWindow->setMenuBar(menuBar);
        mainToolBar = new QToolBar(MainWindow);
        mainToolBar->setObjectName(QString::fromUtf8("mainToolBar"));
        mainToolBar->setStyleSheet(QString::fromUtf8(""));
        MainWindow->addToolBar(Qt::TopToolBarArea, mainToolBar);

        mainToolBar->addAction(action_open);
        mainToolBar->addAction(action_save);
        mainToolBar->addSeparator();
        mainToolBar->addAction(action_line);
        mainToolBar->addAction(action_triangle);
        mainToolBar->addAction(action_rectangle);
        mainToolBar->addAction(action_circle);
        mainToolBar->addAction(action_ellipse);
        mainToolBar->addAction(action_polygon);
        mainToolBar->addSeparator();
        mainToolBar->addAction(action_translate);
        mainToolBar->addAction(action_rotate);
        mainToolBar->addAction(action_zoomin);
        mainToolBar->addAction(action_zoomout);
        mainToolBar->addSeparator();
        mainToolBar->addAction(action_addpoint);
        mainToolBar->addAction(action_deletepoint);
        mainToolBar->addAction(action_palette);
        mainToolBar->addAction(action_trash);
        mainToolBar->addAction(action_help);

        retranslateUi(MainWindow);

        QMetaObject::connectSlotsByName(MainWindow);
    } // setupUi

    void retranslateUi(QMainWindow *MainWindow)
    {
        MainWindow->setWindowTitle(QCoreApplication::translate("MainWindow", "Paint", nullptr));
        action_line->setText(QCoreApplication::translate("MainWindow", "Line", nullptr));
        action_triangle->setText(QCoreApplication::translate("MainWindow", "Triangle", nullptr));
        action_rectangle->setText(QCoreApplication::translate("MainWindow", "Rectangle", nullptr));
        action_circle->setText(QCoreApplication::translate("MainWindow", "Circle", nullptr));
        action_ellipse->setText(QCoreApplication::translate("MainWindow", "ellipse", nullptr));
        action_polygon->setText(QCoreApplication::translate("MainWindow", "Polygon", nullptr));
        action_palette->setText(QCoreApplication::translate("MainWindow", "Palette", nullptr));
        action_translate->setText(QCoreApplication::translate("MainWindow", "Translate", nullptr));
        action_trash->setText(QCoreApplication::translate("MainWindow", "Delete", nullptr));
        action_rotate->setText(QCoreApplication::translate("MainWindow", "Rotate", nullptr));
        action_zoomin->setText(QCoreApplication::translate("MainWindow", "ZoomIn", nullptr));
        action_zoomout->setText(QCoreApplication::translate("MainWindow", "ZoomOut", nullptr));
        action_save->setText(QCoreApplication::translate("MainWindow", "Save", nullptr));
        action_open->setText(QCoreApplication::translate("MainWindow", "Open", nullptr));
        action_clip->setText(QCoreApplication::translate("MainWindow", "Clip", nullptr));
        action_curve->setText(QCoreApplication::translate("MainWindow", "\346\233\262\347\272\277", nullptr));
        action_addpoint->setText(QCoreApplication::translate("MainWindow", "Thicken", nullptr));
        action_deletepoint->setText(QCoreApplication::translate("MainWindow", "Attenuation", nullptr));
        action_help->setText(QCoreApplication::translate("MainWindow", "Help", nullptr));
        label->setText(QString());
    } // retranslateUi

};

namespace Ui {
    class MainWindow: public Ui_MainWindow {};
} // namespace Ui

QT_END_NAMESPACE

#endif // UI_MAINWINDOW_H
