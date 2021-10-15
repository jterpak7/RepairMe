//'use strict';
import { StyleSheet } from 'react-native';


//Master Colors
const mainBlue = "#476e80"
const mainGrey = "#727272"
const lightGrey = "#d9d9d9"
const white = "white"
const accentLight = "#b8d8d8"
const accentGreen = "#7a9e9f"
const accentPink = "#ad7a99"

const shadow = {
   //IOS
   shadowColor: 'rgba(0, 0, 0 ,.4)', 
   shadowOffset: { height: 1, width: 1 }, 
   shadowOpacity: 1,
   shadowRadius: 1,
   //Android
   elevation: 2, // Android
}
const basicBox = {

  textAlign: "center",
  alignItems: "center",
  justifyContent: 'center',

  fontFamily: "RobotoRegular",
  fontSize: 18,
  color: white,

  height: 50,
  width: "66%",
  marginBottom: 20,
  borderWidth: 1,
  borderColor: white,
  borderRadius: 4,

  backgroundColor: mainBlue


}

const basicText = {
  fontFamily: "RobotoRegular",
  fontStyle: "normal",
  textAlign: "center",
  fontSize: 18,
  color: white,
}

const smallWhiteText = {
  fontFamily: "MontserratLight",
  fontStyle: "normal",
  fontSize: 12,
  color: white,
}
export default styles = StyleSheet.create({

  //Colors
  mainBlue: {
    color: mainBlue
  },
  mainGrey: {
    color: mainGrey
  },
  lightGrey:{
    color: lightGrey
  },
  accentLight: {
    color: accentLight
  },
  accentGreen: {
    color: accentGreen
  },
  accentPink: {
    color: accentPink
  },
  white: {
    color: white
  },
  mainBG: {
    backgroundColor: mainBlue,
  },
  shadow: {
    ...shadow
  },

  greyBack:{
    backgroundColor:lightGrey,
    textAlign:"center",
    justifyContent:"center",
    height:28
  },

  logoStyle: {
    flex: 1,
    resizeMode: 'contain'
  },

  descriptionContainer:{
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: '90%'
  },

  container: {
    textAlign: "center",
    alignItems: "center",
    justifyContent: 'center',
    marginBottom: 80,
    height: '20%',
  },
  centerContainer: {
    flexGrow: 1,
    alignItems: 'center',
    flexDirection: 'column'
  },

  basicBox: {
    //required to convert the object to a key
    ...basicBox,
    fontFamily: "RobotoRegular",

    ...shadow
  },

  buttonContrast: {
    //spread operator, taking the entirety of above 
    ...basicBox,
    backgroundColor: white,
    color: mainBlue,
    borderColor: mainBlue,
    ...shadow

  },

  blueTransBox:{
    ...basicBox,
    color: mainBlue, 
    borderColor: mainBlue, 
    backgroundColor: white,
    ...shadow
  },

  basicText: {
    ...basicText,
    fontFamily: "RobotoRegular",
  },

  basicTextContrast: {
    ...basicText,
    color: mainBlue,
  },

  greyText:{
    ...basicText,
    color: mainGrey,
    textAlign: "left",
  },

  descriptionText:{
    color:mainGrey,
    width: "66%", 
    textAlign: "left", 
    marginBottom: 20

  },

  scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  smallWhiteText: {
    ...smallWhiteText
  },

  smallTextHelp: {
    ...smallWhiteText,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    fontFamily: "MontserratLight",
    fontStyle: "normal",
    fontSize: 12,
    color: white,
  },

  title:{
    ...basicText,
    fontSize: 30,
    color: mainBlue,
    marginBottom: 20
  },

  modalContent: {
    flex: 1,
    backgroundColor: white,
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 250,
  },

  ticketDetails: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
    justifyContent: 'center',
  },

  picker: {
    flex: 1,
    height: 350,
    width: 200,
  },

  pickerItem: {
    fontSize: 15,
    height: 75,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  imagePreview: {
    width: "100%", 
    height: 350, 
    marginBottom: 20,
    ...shadow,
    shadowRadius: 2, 
    elevation: 5,
    backgroundColor: '#fff',

},

  tileWithShaddow:{
    
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom:4,
    ...shadow,
    backgroundColor: '#fff',
  },
  errorMessage: {
    marginBottom: 6,
    color: 'red',
    fontSize: 18
  },
  successMessage: {
    marginTop: 6,
    fontSize: 18
  },
  biggerText: {
    ...basicText,
    marginBottom: 10
  }
});

