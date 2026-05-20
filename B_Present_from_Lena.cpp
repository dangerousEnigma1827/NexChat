#include<bits/stdc++.h>
using namespace std;

int main()
{
    int n;cin>>n;
    
    for(int i=0;i<n;i++){
        for(int m=1; m<=2*(n-i); m++){
            cout << " ";
        }
        if(i==0){
            cout<<0<<endl;;
        }else{

            for(int j=0;j<=i;j++){
                cout << j << ' ';
            }
            for(int j=i-1;j>=0;j--){
                if(j){
                    cout << j << ' ';
                }else cout <<j;
            }
            cout<<endl;

        }
    }
    for(int i=n;i>=0;i--){
        for(int m=1; m<=2*(n-i); m++){
            cout << " ";
        }
        
        if(i==0){
            cout<<0<<endl;;
        }else{

            for(int j=0;j<=i;j++){
                cout<<j << ' ';
            }
            for(int j=i-1;j>=0;j--){
                if(j) cout<<j << ' ';
                else cout<<j;
            }
            cout<<endl;

        }
    }
    return 0;
}