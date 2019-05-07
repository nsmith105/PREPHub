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
char returnAChar(char aChar) {
  // Robert Horrace
  return aChar
}
char thisIsAlsoAChar(char aChar) {}
float thisIsAFloat(float aFloat) {}

int main() {
    int num1, num2;
    num1 = num2 = 0;
    float num3 = 0;
    char letter1 = a;
    char letter2 = b;
    bool aBool = false;

    returnABool(aBool)
    print(aBool);

    returnANum(num1);
    print(num1);

    returnAnotherNum(num2); // Danniel Sotelo wrote stuff here
    print(num2); // and Danniel wrote here as well

    thisIsAFloat(num3);
    print(num3);

    returnAChar(letter1)
    print(letter1);

    thisIsAlsoAChar(letter2){
        return letter2;
    }
    print(letter2);

    return 0;
}
