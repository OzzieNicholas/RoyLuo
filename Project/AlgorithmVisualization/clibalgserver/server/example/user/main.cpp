#include "/include/io"
#include "/include/trace"
int main(int argc, char** argv) {
    int n=20;
    int a[20];
    trace_log("N的阶乘");
    trace_array_1d("数组",&a,T_INT,n);
    trace_array_1d_chart("增长趋势",&a,T_INT,n);
    a[0]=1;
    a[1]=1;
    int i;
    for(i=2;i<n;i++){
        a[i]=a[i-1]+a[i-2];
    }
    trace_end("数组");
    trace_end("增长趋势");
}