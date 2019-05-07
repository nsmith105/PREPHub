#include <iostream>
#include <string>

using namespace std;

bool returnABool(bool aThing){}
int returnANum(int aNum){}

int returnAnotherNum(int num2){
  return num2;
}

bool returnABool(bool aThing){
	//justin
	return true;
}
int returnANum(int aNum){
    // haison with a branch
    return aNum;
}

int returnAnotherNum(int anotherNum) {}
<<<<<<< HEAD
char returnAChar(char aChar) {}
char thisIsAlsoAChar(char aChar) {
    //Nick
    aChar = "z";
    return aChar;
}
=======
char returnAChar(char aChar) {
  // Robert Horrace
  return aChar
}
char thisIsAlsoAChar(char aChar) {}
>>>>>>> 54ac4cf9ad04b973b2cef3f83a1d8a3f45ad3bdb
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

<<<<<<< HEAD
    returnAnotherNum(num2);
    cout << num2 << endl;
=======
    returnAnotherNum(num2); // Danniel Sotelo wrote stuff here
    print(num2); // and Danniel wrote here as well
>>>>>>> 54ac4cf9ad04b973b2cef3f83a1d8a3f45ad3bdb

    thisIsAFloat(num3);
    cout << num3 << endl;

<<<<<<< HEAD
    returnAChar(letter1);
    cout << letter1 << endl;

    thisIsAlsoAChar(letter2);
    print(letter2) << endl;
=======
    returnAChar(letter1)
    print(letter1);

    thisIsAlsoAChar(letter2){
        return letter2;
    }
    print(letter2);
>>>>>>> 54ac4cf9ad04b973b2cef3f83a1d8a3f45ad3bdb

    return 0;
}
