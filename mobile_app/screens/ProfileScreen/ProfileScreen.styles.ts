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
        marginTop: 20,
        width: '80%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default styles;