import smartpy as sp


class Storage(sp.Contract):
    def __init__(self, value):
        self.init(storedValue=sp.to_int(value))

    @sp.entry_point
    def update(self, params):
        self.data.storedValue = params.value

    @sp.entry_point
    def multiply(self, params):
        self.data.storedValue *= params.value

    @sp.entry_point
    def add(self, params):
        # sp.set_type(params, sp.TRecord(a=sp.TInt, b=sp.TInt).layout(("b","a")))
        self.data.storedValue += params.a + params.b


@sp.add_test(name="Storage Example")
def test():
    c1 = Storage(12)
    scenario = sp.test_scenario()
    scenario.h1("Storage")
    scenario += c1
    scenario += c1.update(value=15)
    scenario.p("Some computation").show(c1.data.storedValue * 12)
    scenario += c1.update(value=25)
    scenario += c1.multiply(value=2)
    scenario.verify(c1.data.storedValue == 50)
    scenario += c1.add(a=-6, b=-5)
    scenario.verify(c1.data.storedValue == 39)
