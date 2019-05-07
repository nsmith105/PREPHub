#include <iostream>
#include <string>

using namespace std;

bool returnABool(bool aThing){}
int returnANum(int aNum){}
int returnAnotherNum(int anotherNum) {}
char returnAChar(char aChar) {}
char thisIsAlsoAChar(char aChar) {
    //Nick
    aChar = "z";
    return aChar;
}
float thisIsAFloat(float aFloat) {}

int main() {
    int num1, num2;
    num1 = num2 = 0;
    float num3 = 0;
    char letter1 = "a";
    char letter2 = "b";
    bool aBool = false;

    returnABool(aBool);
    cout << aBool << endl;

    returnANum(num1);
    cout << num1 << endl;

    returnAnotherNum(num2);
    cout << num2 << endl;

    thisIsAFloat(num3);
    cout << num3 << endl;

    returnAChar(letter1);
    cout << letter1 << endl;

    thisIsAlsoAChar(letter2);
    print(letter2) << endl;

    return 0;
}
