#include<bits/stdc++.h>
using namespace std;

int main()
{
    int n,l;cin>>n>>l;
    int maxdiff=INT_MIN;
    vector<int> arr;
    for(int i=0; i<n;i++){
        int x;cin>>x;
        arr.push_back(x);
    }
    sort(arr.begin(), arr.end());

    for(int i=0; i<n;i++){
        if(i != 0){
            maxdiff = max(maxdiff, (arr[i]-arr[i-1]));
        }
    }

    if(max({arr[0], maxdiff, l-arr[n-1]}) == maxdiff){
        cout << (float)maxdiff/2;
    }else{
        cout << max({arr[0], maxdiff, l-arr[n-1]});
    }
    return 0;
}