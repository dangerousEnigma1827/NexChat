#include<bits/stdc++.h>
using namespace std;

int main()
{
    int n,a,b,c;
    cin>>n>>a>>b>>c;

    int x = max({a,b,c}), z=min({a,b,c}), y= a+b+c-max({a,b,c})-min({a,b,c});

    if((a==n && b!=n && c!=n) || (b==n && a!=n && c!=n) || (c==n && b!=n && a!=n)){
        cout << (n/y)+(n%y)/z;
    }

    else if((a==n && b==n && c!=n) || (b==n && a!=n && c==n) || (c==n && b!=n && a==n)){
        cout << (n/z);
    }else if(a+b+c == 3*n){
        cout << 1;
    }else{
        cout << (n/x)+(n%x)/y + (n%x%y)/z;
    }

    return 0;
}