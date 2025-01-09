import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#EFE7EC',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#6F4E7C',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#FFF',
        color: '#6F4E7C',
    },
    scrollView: {
        marginBottom: 0,
    },
    card: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#D3D3D3',
        borderRadius: 10,
        backgroundColor: '#FFF',
    },
    addButton: {
        backgroundColor: '#2A9D8F',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        marginRight: 10,
        backgroundColor: '#E63946',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: '#2A9D8F',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    cardInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        paddingHorizontal: 2,
    },
    deleteButton: {
        alignItems: 'flex-end',
        zIndex: 1,
    },
    cardNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6F4E7C',
    }
});

export default styles;