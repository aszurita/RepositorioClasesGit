lista=["Richard","Rjhonatan","Chaulin","Alejandro","Yo"]


def movimientos():
  return lista


def movimiento_nombre(inicial):
  l_r = []
  for nombre in lista:
    if nombre.startswith(inicial):
      l_r.append(nombre)
  return l_r

print("Aprendiendo Python")
print(movimientos())
