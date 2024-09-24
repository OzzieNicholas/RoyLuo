
# QT-OS

#  测试与运行结果

## 进程模块

创建进程时，所有进程就绪

![image](https://github.com/user-attachments/assets/71fda88a-19e9-4e97-a414-ee2e7ddeef20)

开始调度，由下图可见，进程“获取键值”在“键盘输入”未运行完，只执行了一部分时调入运行队列后阻塞。同时“键盘输入”在运行自己的第三个时间片（一个时间片2s，图上显示第6秒）时，请求调入第19号页面。  且运行完的进程所占用的内存块释放。

![image](https://github.com/user-attachments/assets/5fe4cfe4-8347-475e-8e0e-0bceb8437b21)

磁盘调度时显示磁盘调度信息，访问磁道号2，磁盘模块第三行正在被访问，变为红色

![image](https://github.com/user-attachments/assets/42068607-2e11-4199-815c-6fd35db9f7fb)

![image](https://github.com/user-attachments/assets/15864bd6-5601-4602-84f9-e0f29acc27b3)

## 内存模块

内存初始化状态

![image](https://github.com/user-attachments/assets/ac18bf98-c59e-4d03-9ada-199e57b708d2)

虚拟内存初始化状态：

![image](https://github.com/user-attachments/assets/f0d6e72b-387f-4e77-bf85-3f7d6cff11c6)

![image](https://github.com/user-attachments/assets/466d9964-0045-4e2d-960d-8a91b171060d)

![image](https://github.com/user-attachments/assets/e7e40fd0-42f9-43f3-8dc6-300b752b3ffb)

## 文件模块

文件初始创建时

![image](https://github.com/user-attachments/assets/9336766f-c1c9-46f0-bdbc-8e7718327bd2)

![image](https://github.com/user-attachments/assets/4f9ba0a9-c31b-4935-a8e4-965d1fc4200d)

扩展各个文件后

![image](https://github.com/user-attachments/assets/31f8ca86-5b39-46a6-88e0-a3749a0796fa)

操作删除文件

![image](https://github.com/user-attachments/assets/0c877cbb-adb7-42af-9ad0-0716b677f705)

操作后

![image](https://github.com/user-attachments/assets/49c758d0-a838-4d19-baba-5d95ccae35c7)

## 设备管理模块

点击生成按钮，产生一个进程个数为24的进程队列。

![image](https://github.com/user-attachments/assets/50735a4f-003b-4a18-b4ec-77541c2f7c66)

点击每个进程可以查看该进程详情

![image](https://github.com/user-attachments/assets/d869f1ce-8da9-4c86-95e3-42912938be31)

点击开始，展示资源的分配以及进程请求的详细情况

![image](https://github.com/user-attachments/assets/d6c6d942-35c9-48df-b514-09a6cecfa579)

点击发送请求按钮，开始发出请求

![image](https://github.com/user-attachments/assets/175f03c5-8214-4086-bde7-ab21692ffb85)

若请求资源大于need向量，则拒绝请求

![image](https://github.com/user-attachments/assets/f5049bb3-2a69-43ab-8da1-17642b43e607)

![image](https://github.com/user-attachments/assets/f75071aa-17a2-474f-80e1-92e0f6863969)

请求合理则执行安全性算法检测

![image](https://github.com/user-attachments/assets/64e06a33-a592-4c6c-90bb-98057c519138)

![image](https://github.com/user-attachments/assets/576c9231-854c-46ca-b835-f060169e2162)

资源分配

通过则分配资源，进程的need减少，allocati增加，available减少

![image](https://github.com/user-attachments/assets/b347249c-2290-4d1a-8fc4-c2823cf82c97)

资源回收

![image](https://github.com/user-attachments/assets/bf670516-e812-44e8-886d-586cd1e5de3f)

# 概要设计

## 程序流程图

进程管理：

![image](https://github.com/user-attachments/assets/a6bcabc6-47cb-4529-9203-cd69cc18cce8)

内存管理：

![image](https://github.com/user-attachments/assets/1c533f60-8f65-4464-a6d0-f460b632fe90)

文件管理：

![image](https://github.com/user-attachments/assets/6c686c45-e9cf-4035-85f1-f8ac15615bb9)

设备管理：

![image](https://github.com/user-attachments/assets/df8b11b1-ca22-4029-b809-bd4f74b670bd)

## UML图

进程管理：

![image](https://github.com/user-attachments/assets/24502e37-0e58-48e5-bb29-27448d31f8df)

![image](https://github.com/user-attachments/assets/78fa4c1b-49bf-4fc9-8418-8039c0f9ae44)

内存管理：

![image](https://github.com/user-attachments/assets/95f9d5b9-01d9-4bdf-bbff-6fe7a4f5fde4)

文件管理：

![image](https://github.com/user-attachments/assets/a5c391b5-57fc-4397-84b1-8d5bc33d1fd7)

设备管理：

![image](https://github.com/user-attachments/assets/a8e308ca-5bf1-414e-8d1e-7f4cf6999515)

# 详细设计

## 进程相关

### 进程的创建

随机创建三个默认的进程，以及两个进程“获取键值”和“键盘输入”用于模拟进程同步。 手动创建进程时，需要如图输入进程标识符（string类型），进程优先级和所需执行的CPU时间。

![image](https://github.com/user-attachments/assets/8d300cb5-4dbf-44c1-bd2a-d333ed112632)

每次创建进程，会生成一个PCB对象，并将加入进程控制块PCB的对象加入就绪队列中，PCB的属性如下：

![image](https://github.com/user-attachments/assets/4f2a5db1-d88b-4d2c-a26f-6ab10521d407)

同时，当打开文件时也会创建file进程用于模拟进程生成磁盘调度访问磁道号的序列，效果如下：

![image](https://github.com/user-attachments/assets/0d4c0eda-cc08-43ef-8cd1-33164ee39285)

### 状态转换

进程创建后放入就绪队列readyQueue，变为就绪态；当选择不同的调度算法时，会通过不同的调度策略从就绪队列中选择一个进程调度到运行队列runningQueue，转换为运行态；运行态的进程需要的资源没有分配时，进程会转换为阻塞态；并且等待分配资源后再次转换为就绪态。进程执行完后，会转换为完成状态。

![image](https://github.com/user-attachments/assets/c371ad81-6802-4b46-9197-433b65d74576)

### 使用信号量机制模拟多任务系统中的进程同步

通过上图可以观察到，先执行进程“获取键值”，该进程进入阻塞队列;只有进程“键盘输入”执行完成“获取键值”才能从阻塞队列转到就绪队列中。

模拟过程为：

信号量：
semaphore_full： 代表“键盘输入”运行的生产的数据信号量，初始值为0
semaphore_keyboard: 代表键盘输入的临界资源，初值为1
mutex = 1; 代表临界区互斥访问信号量

进程“键盘输入”必须完成后，进程“获取键值”才能运行，如果“获取键值”进程提前进入运行队列，P操作后更改信号量semaphore_full，将会变为阻塞态放入阻塞队列中等待“键盘输入”执行完后V操作释放信号量semaphore_full

进程“获取键值”执行完后会V操作释放semaphore_keyboard，键盘“键盘输入”P操作申请semaphore_keyboard信号量。

模拟PV操作的思路为：通过对进程PCB中“behavior”属性赋值，模拟进程的行为

### 其他略

### 与内存的关系

![image](https://github.com/user-attachments/assets/7f98100e-7694-4252-a462-0e41cb4f897a)

如上图所示，运行进程pro0，首先第一个时间片访问页面2，后面依次逐个访问

## 内存管理

内存初始化状态，初始为400个页框：

![image](https://github.com/user-attachments/assets/729dc9bd-8da2-4293-8030-52b32a9fdcac)

虚拟内存初始化状态：

![image](https://github.com/user-attachments/assets/1cf6786f-8bf1-4bee-9496-03db57434c64)

 内存分配后：

![image](https://github.com/user-attachments/assets/d5c0eb1e-3ec6-4b2b-af77-5ca981f9a8dd)

虚拟内存：

![image](https://github.com/user-attachments/assets/f2174dd0-547c-49b9-b28f-055ed35179ba)

## 文件结构

文件的创建

![image](https://github.com/user-attachments/assets/309dc672-a174-46df-974e-de107c2ee58e)

文件夹的创建

![image](https://github.com/user-attachments/assets/4b5fe8c7-b0a7-4c52-8911-3302947040a1)

## 磁盘调度

当打开文件时，生成“file”文件，调用磁盘调度算法。
磁盘部分设计：每个方格表示一个磁盘块，一行模拟代表一个磁道。磁道号从0-7，分别对应磁盘表格的1-8行。

![image](https://github.com/user-attachments/assets/c983244e-bd2a-4941-973d-d19a124bffa5)

## 设备管理

点击生成按钮，产生一个进程个数为24的进程队列。进程的生成是用随机函数（默认为24个进程），进程的资源请求个数随机生成，allocation向量大于max，则随机数重新赋值。矩阵展示：

![image](https://github.com/user-attachments/assets/23cb0f09-2a97-466d-938f-19aebb6864e5)

请求合理则执行安全性算法检测

![image](https://github.com/user-attachments/assets/132ab188-daeb-47cb-9057-4f8be4997ef3)








