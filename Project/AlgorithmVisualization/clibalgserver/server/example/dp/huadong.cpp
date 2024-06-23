#include "/include/io"
#include "/include/math"
#include "/include/trace"
int main(int argc, char** argv) {
    int D[20],i;
    int n=sizeof(D)/sizeof(int);
    trace_log("数组初始化");
    trace_array_1d("数组",&D,T_INT,n);
    for(i=0;i<n;i++){
        D[i]=i;
    }
    int sum=D[0]+D[1]+D[2];
    int sumArray[18];
    trace_log("窗口大小为3");
    trace_array_1d_chart("滑动窗口之和",&sumArray,T_INT,18);
    int j=0;
    int max=sum;
    trace_log("计算滑动窗口之和的最大值");
    trace_var("滑动窗口之和最大值",&max,T_INT);
    for (i = 0; i < 18; i++) {
        sum = D[i] +D[i+1]+D[i + 2];
        if (max < sum) max = sum;
        sumArray[j++]=sum;
    }
    trace_end("数组");
    trace_end("滑动窗口之和");
    trace_end("滑动窗口之和最大值");
}