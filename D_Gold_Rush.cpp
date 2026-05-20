#include<bits/stdc++.h>
using namespace std;

bool ans(int n, int m){

    if(n == 0) return 0;

    if(n == m){
        return 1;
    }else{
        return ans(n/3, m) || ans(2*n/3, m);
    }
}

int main()
{
    int t;
    cin >> t;
    
    while(t--){
        int n,m;cin>>n>>m;
        cout << ans(n, m) << endl;
    }
    return 0;
}