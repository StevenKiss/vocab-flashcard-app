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
        paddingHorizontal: 5,
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
        marginTop: 5,
    },
    cardListContainer: {
        alignItems: 'center',
    },
    cardWrapper: {
        width: 300,
        height: 150,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInnerContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    cardContainer: {
        marginBottom: 10,
        alignItems: 'center',
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#FFFFFF',
        elevation: 4,
    },
    cardFront: {
        backgroundColor: '#FFF',
    },
    cardBack: {
        backgroundColor: '#DCCEF9',
    },
    cardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6F4E7C',
        textAlign: 'center',
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
        fontWeight: 'bold',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    customizeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rbga(0, 0, 0, 0.5)'
    },
    customizeContent: {
        width: '90%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    customizeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6F4E7C',
        marginBottom: 20,
        textAlign: 'center',
    },
    picker: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 20,
        elevation: 3,
        width: '100%',
    },
    customizeLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6F4E7C',
    },
    saveButton: {
        backgroundColor: '#6F4E7C',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    customizeButton: {
        backgroundColor: '#6F4E7C',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
        alignSelf: 'center',
        width: '80%',
    },
    customizeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pickerModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    pickerContainer: {
        width: '85%',
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
    },
    pickerSaveButton: {
        backgroundColor: '#6F4E7C',
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    pickerSaveText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default styles;
