import matplotlib.pyplot as plt

def plot_history(history):
    plt.plot(history.history['accuracy'])
    plt.plot(history.history['val_accuracy'])
    plt.title("Accuracy Curve")
    plt.legend(["Train", "Validation"])
    plt.show()

    plt.plot(history.history['loss'])
    plt.plot(history.history['val_loss'])
    plt.title("Loss Curve")
    plt.legend(["Train", "Validation"])
    plt.show()
