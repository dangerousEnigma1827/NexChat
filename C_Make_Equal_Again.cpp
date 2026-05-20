#include<bits/stdc++.h>
using namespace std;

int main()
{
    int t;
    cin >> t;
    
    while(t--){
        int n;cin>>n;
        vector<int> arr;
        for(int i=0;i<n;i++){
            int x;cin>>x;
            arr.push_back(x);
        }

        if(arr[0]==arr[n-1]){
            int fstreak=0, lstreak=0;
            for(int i=0;i<n;i++){
                if(arr[i]==arr[0]){
                    fstreak++;
                }else{
                    break;
                }
            }
            for(int i=n-1;i>=0;i--){
                if(arr[i]==arr[n-1]){
                    lstreak++;
                }else{
                    break;
                }
            }

            if(fstreak == lstreak && fstreak == n){
                cout<<0<<endl;
            }else{
                cout << n-fstreak-lstreak <<endl;
            }

        }else{
            int fstreak=0, lstreak=0;
            for(int i=0;i<n;i++){
                if(arr[i]==arr[0]){
                    fstreak++;
                }else{
                    break;
                }
            }
            for(int i=n-1;i>=0;i--){
                if(arr[i]==arr[n-1]){
                    lstreak++;
                }else{
                    break;
                }
            }

            cout << n-max(fstreak, lstreak) << endl;
        }
    }
    return 0;
}