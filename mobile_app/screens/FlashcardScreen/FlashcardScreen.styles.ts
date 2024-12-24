import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    },
    flashcardContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    cardWrapper: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    card: {
        position: 'absolute',
        width: 300,
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
        borderRadius: 10,
        padding: 20,
        backgroundColor: '#FFFFFF',
        elevation: 4,
    },
    cardFront: {
        backfaceVisibility: 'hidden',
        backgroundColor: '#FFFFFF'
    },
    cardBack: {
        backfaceVisibility: 'hidden',
        backgroundColor: '#DCCEF9',
    },
    cardTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 0,
        marginBottom: 0,
        zIndex: 1, // Ensure above Swiper
    },
    progressText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6F4E7C',
    },
    backButton: {
        padding: 10,
    },
    settingsButton: {
        padding: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6F4E7C',
    },
    progressBarContainer: {
        height: 5,
        backgroundColor: '#E0e0e0',
        marginHorizontal: 15,
        marginBottom: 15,
        marginVertical: 10,
        borderRadius: 3,
        zIndex: 1, // Ensure above Swiper
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#6F4E7C',
        borderRadius: 3,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        zIndex: 1, // Ensure above Swiper
    },
    unknownText: {
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold',
    },
    knownText: {
        fontSize: 18,
        color: 'green',
        fontWeight: 'bold',
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'EFE7EC',
    },
    appContainer: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    },
    endContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    endText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6F4E7C',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    endButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    finishedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    finishedText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    bottomSection: {
        height: 60, 
        backgroundColor: '#F7F3F7',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    bottomButton: {
        width: 50,
        height: 50,
        backgroundColor: '#6F4E7C',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        zIndex: 10,
    },
    icon: {
        fontSize: 24,
        color: '#FFFFFF',
    },
});

export default styles;