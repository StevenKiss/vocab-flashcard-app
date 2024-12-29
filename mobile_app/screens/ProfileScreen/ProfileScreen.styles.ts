import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFE7EC',
        padding: 20,
        alignItems: 'center'
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#EFE7EC',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6F4E7C',
        marginBottom: 20,
    },
    infoContainer: {
        marginVertical: 20,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D3D3D3',
    },
    infoText: {
        fontSize: 18,
        color: '#6F4E7C',
    },
    button: {
        backgroundColor: '#6F4E7C',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6f4E7C',
    },
    input: {
        width: '100%',
        backgroundColor: '#EFE7EC',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#D3D3D3',
    },
    cancelButton: {
        marginTop: 10,
        backgroundColor: '#D3D3D3',
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 16,
    },
});

export default styles;