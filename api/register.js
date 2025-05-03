fix register    console.error("Errore durante la registrazione:", err);
    return res.status(500).json({ message: "Errore del server", error: err.message });
  }
};
