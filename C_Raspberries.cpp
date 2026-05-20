#include<bits/stdc++.h>
using namespace std;

int main()
{
    int t;
    cin >> t;
    
    while(t--){
        int n,k;cin>>n>>k;
        vector<int> arr;

        bool divexist=false;
        for(int i=0;i<n;i++){
            int x;
            cin>>x;
            arr.push_back(x % k);
            if(x % k==0) divexist=1;
        }

        if(divexist){
            cout<<0<<endl;
            continue;
        }

        if(k==4){
            if(binary_search(arr.begin(), arr.end(), 3)){
                cout << 1 << endl;
            }else{
                cout << 2 << endl;
            }

            continue;
        }

        if(k==2){
            cout<< 1 <<endl;continue;
        }

        if(k==3){
            if(binary_search(arr.begin(), arr.end(), 1)){
                cout << 2 << endl;
            }else{
                cout << 1 << endl;
            } 
            continue;
        }

        if(k==5){
            if(binary_search(arr.begin(), arr.end(), 4)){
                cout << 1 << endl;
            }else if(binary_search(arr.begin(), arr.end(), 3)){
                cout << 2 << endl;
            }else if(binary_search(arr.begin(), arr.end(), 2)){
                cout << 3 << endl;
            }else if(binary_search(arr.begin(), arr.end(), 1)){
                cout << 4 << endl;
            }
            continue;
        }
    }
    return 0;
}