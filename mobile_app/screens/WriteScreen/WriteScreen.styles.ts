import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    progressText: {
        fontSize: 18,
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
    writerContainer: {
        marginTop: 80,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSection: {
        height: 60,
        backgroundColor: '#EFE7EC',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    navButton: {
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#EFE7EC',
    },
    referenceContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 15,
    },
    referenceText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#6F4E7C',
        textAlign: 'center',
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
    incorrectButton: {
        backgroundColor: '#F44336',
        padding: 15,
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    correctButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 50,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 20,
    },
});

export default styles;
