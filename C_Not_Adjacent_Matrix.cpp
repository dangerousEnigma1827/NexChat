#include<bits/stdc++.h>
using namespace std;

int main()
{
    int t;
    cin >> t;
    
    while(t--){
        int n;cin>>n;

        if(n == 1){
            cout<<1<<endl;
            continue;
        }
        if(n==2){
            cout<<-1<<endl;
            continue;;
        }

        // for(int i=1; i<=(n*n/2); i++){
        //     cout << 2*i<<" ";
        //     if(i % n == 0) cout << endl;
        // }
        int count=0;
        for(int i=1; i<=(n*n); i++){
            if(i%2==0){
                cout << i<<" ";
                count++;
                if(count % n == 0) cout <<endl;
            }
                
        }
        for(int i=1; i<=(n*n); i++){
            if(i % 2 == 1){
                cout << i<<" ";
                count++;
                if(count % n == 0) cout <<endl;
            }
        }
    }
    return 0;
}