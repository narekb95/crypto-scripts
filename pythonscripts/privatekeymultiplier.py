# This script takes as input a private key (256 bit integer in hexadecimal) and a number n.
# It generates n keys such that the xor of all the output-keys is the given private key.
import os
import sys
import binascii
def generateRandomKey():
    return int(binascii.hexlify( os.urandom(32) ).decode(), 16)

privatekey = 0
numOfKeys = 0
if len(sys.argv) > 1:
    privatekey = int(sys.argv[1], 0);
else:
    privatekey = int(input("Enter your private key (with 0x prefix): "), 0);
if len(sys.argv) > 2:
    numOfKeys = int(sys.argv[2]);
else:
    numOfKeys = int(input("Enter the total number of needed keys: "));

print("Private key: " + str(privatekey))
keysList = []
lastKey = privatekey
for i in range(numOfKeys-1):
    randomkey = generateRandomKey();
    keysList.append(randomkey)
    lastKey ^= randomkey
keysList.append(lastKey)
for i in range(len(keysList)):
        filename = "key"+"{:03d}".format(i);
        f = open(filename, 'w');
        f.write(hex(keysList[i-1]))
        print(hex(keysList[i-1]))
    

    
