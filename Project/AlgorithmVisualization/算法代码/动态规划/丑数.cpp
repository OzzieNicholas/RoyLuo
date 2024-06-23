#include "/include/io"
#include "/include/math"
#include "/include/trace"
int main(int argc, char** argv) {
  int A[15];
  trace_array_1d("数组",&A,T_INT,15);
  int i;
  int UglyNumber[10];
  trace_log("数组初始化");
  for(i=0;i<15;i++){
    A[i]=i;
  }
  trace_log("寻找丑数");
  trace_array_1d("丑数",&UglyNumber,T_INT,10);
  int j=0;
  for(i=0;i<15;i++){
    int num=A[i];
    while(num>0){
      if (num == 1 || num == 2 || num == 3 || num == 5) {
        UglyNumber[j++]=A[i];
        break;
      }
      if (num%2 == 0) {
        num /= 2;
      }else if (num%3 == 0) {
        num /= 3;
      }else if (num%5 == 0) {
        num /= 5;
      }else {
        break;
      }
    }
   
    
  }
  
  trace_end("数组");
  trace_end("丑数");
}