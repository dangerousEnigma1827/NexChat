/*
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     ▓█████▄  ▄▄▄       ███▄    █   ▄████ ▓█████  ██▀███      ║
║     ▒██▀ ██▌▒████▄     ██ ▀█   █  ██▒ ▀█▒▓█   ▀ ▓██ ▒ ██▒    ║
║     ░██   █▌▒██  ▀█▄  ▓██  ▀█ ██▒▒██░▄▄▄░▒███   ▓██ ░▄█ ▒    ║
║     ░▓█▄   ▌░██▄▄▄▄██ ▓██▒  ▐▌██▒░▓█  ██▓▒▓█  ▄ ▒██▀▀█▄      ║
║     ░▒████▓  ▓█   ▓██▒▒██░   ▓██░░▒▓███▀▒░▒████▒░██▓ ▒██▒    ║
║      ▒▒▓  ▒  ▒▒   ▓▒█░░ ▒░   ▒ ▒  ░▒   ▒ ░░ ▒░ ░░ ▒▓ ░▒▓░    ║
║      ░ ▒  ▒   ▒   ▒▒ ░░ ░░   ░ ▒░  ░   ░  ░ ░  ░  ░▒ ░ ▒░    ║
║      ░ ░  ░   ░   ▒      ░   ░ ░ ░ ░   ░    ░     ░░   ░     ║
║        ░          ░  ░         ░       ░    ░  ░   ░         ║
║      ░                                                       ║
║                    dangerousEnigma                           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
*/

#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
#include <numeric>
#include <map>
#include <unordered_map>
#include <set>
#include <unordered_set>
#include <queue>
#include <stack>
#include <deque>
#include <string>
#include <cstring>
#include <climits>
#include <iomanip>
#include <chrono>

using namespace std;

#define fastio ios::sync_with_stdio(false); cin.tie(nullptr);

using ll = long long;
using vi = vector<int>;
using vb = vector<bool>;
using vll = vector<ll>;

#define pb push_back
#define all(x) (x).begin(), (x).end()
#define rall(x) (x).rbegin(), (x).rend()

#define rep(i, a, b) for (int i = (a); i < (b); ++i)
#define per(i, a, b) for (int i = (b) - 1; i >= (a); --i)

#define yes cout << "YES\n"
#define no cout << "NO\n"
#define rt return

#ifdef LOCAL
#define debug(x) cerr << #x << " = " << x << '\n';
#else
#define debug(x)
#endif

template<typename T>
istream& operator>>(istream& in, vector<T>& v) {
    for (auto& x : v) in >> x;
    return in;
}

template<typename T>
ostream& operator<<(ostream& out, const vector<T>& v) {
    for (size_t i = 0; i < v.size(); ++i)
        out << v[i] << (i + 1 == v.size() ? "" : " ");
    return out;
}

struct custom_hash {
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
        x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
        return x ^ (x >> 31);
    }

    size_t operator()(uint64_t x) const {
        static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
        return splitmix64(x + FIXED_RANDOM);
    }
};

const ll MOD = 1e9 + 7;

inline ll modAdd(ll a, ll b) {
    return (a % MOD + b % MOD) % MOD;
}

inline ll modSub(ll a, ll b) {
    return ((a % MOD - b % MOD) + MOD) % MOD;
}

inline ll modMul(ll a, ll b) {
    return ((a % MOD) * (b % MOD)) % MOD;
}

ll Pow(ll base, ll exp) {
    ll res = 1;
    base %= MOD;
    while (exp > 0) {
        if (exp % 2 == 1) res = modMul(res, base);
        base = modMul(base, base);
        exp /= 2;
    }
    return res;
}

inline ll modInv(ll n) {
    return Pow(n, MOD - 2);
}

inline ll modDiv(ll a, ll b) {
    return modMul(a, modInv(b));
}

void solve() {
    int x;cin>>x;
    int b=1;
    for(int a=1; a*a*a<=x; a++){
        b*b*b = x - (a*a*a)
    }
    cout<<
}

int main() {
    fastio;

    int t = 1;
    cin >> t;

    while (t--) {
        solve();
    }

    return 0;
}