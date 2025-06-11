import pool from "../services/db"; // Importando o pool de conexões

class Evento {
  id?: number;
  nome: string;
  descricao?: string;
  data_inicio: string;
  data_fim: string;
  local_id: number;
  status: "Confirmado" | "Agendado" | "Cancelado" | "Concluído" = "Agendado";
  preco_entrada: number;
  imagem_url?: string;

  constructor(
    id: number | undefined,
    nome: string,
    data_inicio: string,
    data_fim: string,
    local_id: number,
    status: "Confirmado" | "Agendado" | "Cancelado" | "Concluído" = "Agendado",
    preco_entrada: number,
    descricao?: string,
    imagem_url?: string
  ) {
    // Validações
    if (!local_id) throw new Error("ID do local é obrigatório.");

    if (!nome.trim()) throw new Error("Nome é obrigatório.");
    if (new Date(data_inicio) > new Date(data_fim)) throw new Error("Data de início não pode ser após a data de fim.");
    if (preco_entrada < 0 || null) throw new Error("Preço de entrada não pode ser negativo.");

    this.id = id;
    this.nome = nome;
    this.data_inicio = data_inicio;
    this.data_fim = data_fim;
    this.local_id = local_id;
    this.status = status;
    this.preco_entrada = preco_entrada;
    this.descricao = descricao;
    this.imagem_url = imagem_url;
  }

  getId(): number | undefined {
    return this.id;
  }

  setId(id: number): void {
    this.id = id;
  }

  getNome(): string {
    return this.nome;
  }

  setNome(nome: string): void {
    if (!nome.trim()) throw new Error("Nome é obrigatório.");
    this.nome = nome;
  }

  getDescricao(): string | undefined {
    return this.descricao;
  }

  setDescricao(descricao: string | undefined): void {
    this.descricao = descricao;
  }

  getDataInicio(): string {
    return this.data_inicio;
  }

  setDataInicio(data_inicio: string): void {
    if (new Date(data_inicio) > new Date(this.data_fim)) {
      throw new Error("Data de início não pode ser após a data de fim.");
    }
    this.data_inicio = data_inicio;
  }

  getDataFim(): string {
    return this.data_fim;
  }

  setDataFim(data_fim: string): void {
    if (new Date(this.data_inicio) > new Date(data_fim)) {
      throw new Error("Data de início não pode ser após a data de fim.");
    }
    this.data_fim = data_fim;
  }

  getLocalId(): number {
    return this.local_id;
  }

  setLocalId(local_id: number): void {
    if (!local_id) throw new Error("ID do local é obrigatório.");
    this.local_id = local_id;
  }

  getStatus(): "Confirmado" | "Agendado" | "Cancelado" | "Concluído" {
    return this.status;
  }

  setStatus(status: "Confirmado" | "Agendado" | "Cancelado" | "Concluído"): void {
    this.status = status;
  }

  getPrecoEntrada(): number {
    return this.preco_entrada;
  }

  setPrecoEntrada(preco_entrada: number): void {
    if (preco_entrada < 0) throw new Error("Preço de entrada não pode ser negativo.");
    this.preco_entrada = preco_entrada;
  }

  getImagemUrl(): string | undefined {
    return this.imagem_url;
  }

  setImagemUrl(imagem_url: string | undefined): void {
    this.imagem_url = imagem_url;
  }

  static async findById(id: number): Promise<Evento | null> {
    const res = await pool.query("SELECT * FROM evento WHERE id = $1", [id]);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return new Evento(
      row.id,
      row.nome,
      row.data_inicio,
      row.data_fim,
      row.local_id,
      row.status,
      row.preco_entrada,
      row.descricao,
      row.imagem_url
    );
  }

  static async findAll(): Promise<Evento[]> {
    const res = await pool.query("SELECT * FROM evento");
    return res.rows.map(
      (row: Evento) =>
        new Evento(
          row.id,
          row.nome,
          row.data_inicio,
          row.data_fim,
          row.local_id,
          row.status,
          row.preco_entrada,
          row.descricao,
          row.imagem_url
        )
    );
  }

  async insert(): Promise<number> {
    const res = await pool.query(
      `INSERT INTO evento (nome, descricao, data_inicio, data_fim, local_id, status, preco_entrada, imagem_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        this.nome,
        this.descricao ?? null,
        this.data_inicio,
        this.data_fim,
        this.local_id,
        this.status,
        this.preco_entrada,
        this.imagem_url ?? null,
      ]
    );
    this.id = res.rows[0].id;
    return this.id!;
  }

  async updateFull(): Promise<void> {
    if (!this.id) throw new Error("ID é obrigatório para atualizar.");

    await pool.query(
      `UPDATE evento SET 
     nome = $1, 
     descricao = $2, 
     data_inicio = $3, 
     data_fim = $4, 
     local_id = $5, 
     status = $6, 
     preco_entrada = $7, 
     imagem_url = $8 
     WHERE id = $9`,
      [
        this.nome,
        this.descricao ?? null,
        this.data_inicio,
        this.data_fim,
        this.local_id,
        this.status,
        this.preco_entrada,
        this.imagem_url ?? null,
        this.id,
      ]
    );
  }

  async updatePartial(fields: Partial<Omit<Evento, "id">>): Promise<void> {
    if (!this.id) throw new Error("ID é obrigatório para atualizar.");

    const keys = Object.keys(fields) as (keyof Evento)[];
    if (keys.length === 0) return;

    const updates: string[] = [];
    const values: any[] = [];

    keys.forEach((key, index) => {
      updates.push(`${key} = $${index + 1}`);
      values.push((fields as any)[key]);
      (this as any)[key] = (fields as any)[key]; // Atualiza a instância local também
    });

    values.push(this.id); // Adiciona o ID no final dos valores

    const query = `UPDATE evento SET ${updates.join(", ")} WHERE id = $${values.length}`;
    await pool.query(query, values);
  }

  static async delete(id: number): Promise<void> {
    await pool.query("DELETE FROM evento WHERE id = $1", [id]);
  }
}

export default Evento;
