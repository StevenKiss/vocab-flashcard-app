import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: '#EFE7EC',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6F4E7C',
    },
    progressText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#6F4E7C',
        marginVertical: 10,
    },
    cardListContainer: {
        paddingBottom: 0,
    },
    cardContainer: {
        marginBottom: 10,
        alignItems: 'center',
    },
    card: {
        width: 300,
        height: 150,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    cardBack: {
        backgroundColor: '#DCCEF9',
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6F4E7C',
    },
    bottomButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: -20,
    },
    actionButton: {
        backgroundColor: '#6F4E7C',
        padding: 15,
        borderRadius: 10,
        width: '40%',
        alignItems: 'center',
    },
    writeModeButton: {
        backgroundColor: '#DCCEF9',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalOption: {
        width: '100%',
        padding: 15,
        borderRadius: 5,
        backgroundColor: '#6F4E7C',
        marginBottom: 10,
        alignItems: 'center',
    },
    modalOptionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalCloseButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#6F4E7C',
        borderRadius: 5,
    },
    closeText: {
        color: '#FFF',
        fontSize: 14,
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default styles;
