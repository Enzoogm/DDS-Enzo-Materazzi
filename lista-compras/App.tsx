import { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';

type ItemDeCompra = {
  id: string;
  nombre: string;
  completado: boolean;
};

function useListaDeCompras() {
  const [items, setItems] = useState<ItemDeCompra[]>([]);

  const agregarItem = useCallback((nombre: string) => {
    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) return;

    setItems((prev) => [
      ...prev,
      { id: String(Date.now()), nombre: nombreLimpio, completado: false },
    ]);
  }, []);

  const alternarEstadoItem = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, completado: !it.completado } : it))
    );
  }, []);

  const eliminarItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  return { items, agregarItem, alternarEstadoItem, eliminarItem };
}

function BotonParaAgregarItem({ onAgregar }: { onAgregar: () => void }) {
  return (
    <Pressable style={styles.botonAgregar} onPress={onAgregar}>
      <Text style={styles.textoBoton}>Agregar</Text>
    </Pressable>
  );
}

function CampoDeTextoParaProducto({ valor, alCambiar, alEnviar }: { valor: string; alCambiar: (t: string) => void; alEnviar: () => void }) {
  return (
    <TextInput
      value={valor}
      onChangeText={alCambiar}
      placeholder="Ej: Leche"
      style={styles.campoTexto}
      returnKeyType="done"
      onSubmitEditing={alEnviar}
    />
  );
}

function FilaParaItemDeCompra({ item, alAlternar, alEliminar }: { item: ItemDeCompra; alAlternar: (id: string) => void; alEliminar: (id: string) => void; }) {
  return (
    <Pressable
      onPress={() => alAlternar(item.id)}
      onLongPress={() => alEliminar(item.id)}
      style={styles.filaItem}
    >
      <Text style={[styles.textoItem, item.completado && styles.textoTachado]}>
        {item.nombre}
      </Text>
      <Text style={[styles.pildora, item.completado ? styles.pildoraCompletada : styles.pildoraPendiente]}>
        {item.completado ? '✔' : '•'}
      </Text>
    </Pressable>
  );
}

function ContenedorDeListaDeCompras({ items, alAgregar, alAlternar, alEliminar }: { items: ItemDeCompra[]; alAgregar: (nombre: string) => void; alAlternar: (id: string) => void; alEliminar: (id: string) => void; }) {
  const [texto, setTexto] = useState('');

  const manejarAgregado = () => {
    alAgregar(texto);
    setTexto('');
  };

  return (
    <View style={styles.contenedorPrincipal}>
      <Text style={styles.titulo}>Lista de Compras</Text>

      <View style={styles.filaEntrada}>
        <CampoDeTextoParaProducto valor={texto} alCambiar={setTexto} alEnviar={manejarAgregado} />
        <BotonParaAgregarItem onAgregar={manejarAgregado} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        renderItem={({ item }) => (
          <FilaParaItemDeCompra item={item} alAlternar={alAlternar} alEliminar={alEliminar} />
        )}
        ListEmptyComponent={<Text style={styles.textoVacio}>Sin productos. Agrega el primero</Text>}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        contentContainerStyle={styles.listaContenido}
      />
    </View>
  );
}

export default function ControladorDeAplicacion() {
  const { items, agregarItem, alternarEstadoItem, eliminarItem } = useListaDeCompras();

  return (
    <ContenedorDeListaDeCompras
      items={items}
      alAgregar={agregarItem}
      alAlternar={alternarEstadoItem}
      alEliminar={eliminarItem}
    />
  );
}

const styles = StyleSheet.create({
  contenedorPrincipal: { flex: 1, padding: 16, paddingTop: 50, gap: 12, backgroundColor: '#fff' },
  titulo: { fontSize: 24, fontWeight: 'bold', marginTop: 12 },
  filaEntrada: { flexDirection: 'row', gap: 8 },
  campoTexto: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  botonAgregar: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: { color: '#fff', fontWeight: '600' },
  filaItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textoItem: { fontSize: 16 },
  textoTachado: { textDecorationLine: 'line-through', color: '#999' },
  pildora: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '700',
  },
  pildoraPendiente: { backgroundColor: '#eee', color: '#666' },
  pildoraCompletada: { backgroundColor: '#2ecc71', color: '#fff' },
  separador: { height: 1, backgroundColor: '#eee' },
  textoVacio: { textAlign: 'center', color: '#777', marginTop: 24 },
  listaContenido: { paddingBottom: 32 }
});