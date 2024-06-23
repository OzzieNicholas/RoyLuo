#include "/include/io"
#include "/include/math"
#include "/include/trace"
int main(int argc, char** argv) {
  int D[20],i;
  int n=sizeof(D)/sizeof(int);
  trace_log("�����ʼ��");
  trace_array_1d("����",&D,T_INT,n);
  for(i=0;i<n;i++){
    D[i]=i;
  }
  int sum=D[0]+D[1]+D[2];
  int sumArray[18];
  trace_log("���ڴ�СΪ3");
  trace_array_1d_chart("��������֮��",&sumArray,T_INT,18);
  int j=0;
  int max=sum;
  trace_log("���㻬������֮�͵����ֵ");
  trace_var("��������֮�����ֵ",&max,T_INT);
  for (i = 0; i < 18; i++) {
    sum = D[i] +D[i+1]+D[i + 2];
    if (max < sum) max = sum;
    sumArray[j++]=sum;
  }
  trace_end("����");
  trace_end("��������֮��");
  trace_end("��������֮�����ֵ");
}