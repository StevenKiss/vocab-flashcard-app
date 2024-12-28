import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFE7EC',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'EFE7EC',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6F4E7C',
        textAlign: 'center',
        marginBottom: 20,
    },
    subHeaderText: {
        fontSize: 18,
        color: '#6F4E7C',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        backgroundColor: 'FFF',
        padding: 12,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#D3D3D3',
    },
    button: {
        backgroundColor: '#6F4E7C',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 0,
    },
    toggleText: {
        color: '#6F4E7C',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 15,
        textDecorationLine: 'underline',
    },
})

export default styles;