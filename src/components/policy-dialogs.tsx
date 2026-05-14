'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useUIStore, type PolicyType } from '@/store/ui-store'
import { RotateCcw, Truck, Shield, BookOpen } from 'lucide-react'

const policyMeta: Record<Exclude<PolicyType, null>, {
  title: string
  icon: React.ElementType
}> = {
  reembolso: { title: 'Política de Reembolso', icon: RotateCcw },
  entrega: { title: 'Política de Entrega', icon: Truck },
  privacidade: { title: 'Política de Privacidade', icon: Shield },
  reclamacoes: { title: 'Livro de Reclamações', icon: BookOpen },
}

function PolicyContent({ type }: { type: Exclude<PolicyType, null> }) {
  switch (type) {
    case 'reembolso':
      return (
        <div className="space-y-6 text-[#5C7A6B] leading-relaxed">
          <p className="text-sm italic">Última atualização: Maio 2025</p>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">1. Direito de Resolução</h3>
            <p>Nos termos do Decreto-Lei n.º 24/2014, o consumidor tem o direito de resolver o contrato de compra e venda sem indicar qualquer motivo, no prazo de 14 dias a contar da data em que o consumidor ou um terceiro por si designado adquira a posse física dos bens.</p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">2. Condições de Devolução</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>O pedido de devolução deve ser efetuado no prazo de 14 dias após a receção do produto.</li>
              <li>Os produtos devem ser devolvidos na sua embalagem original, em perfeitas condições de conservação.</li>
              <li>Produtos perecíveis (frutos frescos) só são elegíveis para reembolso em caso de defeito de qualidade comprovado na data de entrega.</li>
              <li>Produtos congelados não são elegíveis para devolução após a entrega, salvo em caso de avaria na cadeia de frio imputável à Lovelyproportion.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">3. Processo de Devolução</h3>
            <p>Para iniciar o processo de devolução, contacte-nos através de:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Email: info@lovelyproportion.pt</li>
              <li>Telefone: +351 232 000 000</li>
            </ul>
            <p className="mt-2">Deverá indicar o número de encomenda, o motivo da devolução e fotografias comprovativas, quando aplicável.</p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">4. Modalidades de Reembolso</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Reembolso integral:</strong> Quando o produto apresentar defeito de qualidade ou não corresponder à descrição.</li>
              <li><strong>Reembolso parcial:</strong> Quando apenas parte da encomenda for objeto de reclamação.</li>
              <li><strong>Substituição:</strong> Em alternativa ao reembolso, poderemos proceder à substituição do produto, sujeito a disponibilidade.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">5. Prazo de Reembolso</h3>
            <p>O reembolso será processado no prazo máximo de 14 dias após a receção e verificação do produto devolvido. O reembolso será efetuado pelo mesmo meio de pagamento utilizado na compra, salvo acordo em contrário.</p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">6. Custos de Devolução</h3>
            <p>Os custos de devolução direta são da responsabilidade do consumidor, exceto quando a devolução resulta de um defeito do produto ou de erro nosso. Neste caso, a Lovelyproportion suportará os custos de transporte.</p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">7. Exceções</h3>
            <p>Não são elegíveis para devolução:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Produtos frescos que tenham sido armazenados de forma incorreta pelo cliente após a entrega.</li>
              <li>Produtos congelados após a receção (salvo avaria na cadeia de frio).</li>
              <li>Cabazes mistos personalizados.</li>
              <li>Produtos que tenham sido parcialmente consumidos.</li>
            </ul>
          </div>
        </div>
      )

    case 'entrega':
      return (
        <div className="space-y-6 text-[#5C7A6B] leading-relaxed">
          <p className="text-sm italic">Última atualização: Maio 2025</p>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">1. Zona de Entrega</h3>
            <p>Realizamos entregas em <strong>Portugal Continental</strong>. Para entregas nas Regiões Autónomas (Açores e Madeira) e internacional, por favor contacte-nos diretamente para obter um orçamento personalizado.</p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">2. Prazos de Entrega</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Produtos Frescos:</strong> Entrega em 24-48h úteis após confirmação do pagamento, de terça a sexta-feira.</li>
              <li><strong>Produtos Congelados:</strong> Entrega em 24-72h úteis, com manutenção da cadeia de frio.</li>
              <li><strong>Cabazes Mistos:</strong> Entrega em 24-48h úteis, sujeito à disponibilidade dos produtos frescos incluídos.</li>
              <li><strong>Encomendas B2B:</strong> Entrega personalizada mediante acordo prévio.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">3. Custos de Envio</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-[#B7E4C7] rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-[#D8F3DC]">
                    <th className="text-left p-3 text-[#1B4332] font-semibold">Valor da Encomenda</th>
                    <th className="text-left p-3 text-[#1B4332] font-semibold">Custo de Envio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#B7E4C7]">
                    <td className="p-3">Até 25€</td>
                    <td className="p-3">5,99€</td>
                  </tr>
                  <tr className="border-t border-[#B7E4C7] bg-[#F0F4F0]">
                    <td className="p-3">25€ — 50€</td>
                    <td className="p-3">3,99€</td>
                  </tr>
                  <tr className="border-t border-[#B7E4C7]">
                    <td className="p-3">Superior a 50€</td>
                    <td className="p-3 font-semibold text-[#2D6A4F]">Grátis</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">4. Cadeia de Frio</h3>
            <p>Todas as nossas entregas de produtos frescos e congelados são realizadas com embalagem isotérmica e gelo seco/acumuladores de frio, garantindo a manutenção da temperatura adequada durante todo o transporte.</p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">5. Horário de Entrega</h3>
            <p>As entregas são realizadas no horário de 9h00 às 18h00, de terça a sexta-feira. No momento da compra, poderá indicar a sua preferência de horário (manhã: 9h-13h / tarde: 13h-18h), sujeito a disponibilidade.</p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">6. Receção da Encomenda</h3>
            <p>Ao receber a encomenda, recomendamos que:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Verifique o estado da embalagem exterior antes de aceitar a entrega.</li>
              <li>Confirme a temperatura dos produtos frescos e congelados.</li>
              <li>Registe qualquer anomalia no momento da entrega junto do transportador.</li>
              <li>Refrigere imediatamente os produtos frescos após a receção.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">7. Falha na Entrega</h3>
            <p>Em caso de ausência no local de entrega, o transportador deixará um aviso e tentará uma segunda entrega no dia útil seguinte. Após duas tentativas falhadas, a encomenda será devolvida ao nosso armazém. Neste caso, os custos de reenvio serão da responsabilidade do cliente.</p>
          </div>
        </div>
      )

    case 'privacidade':
      return (
        <div className="space-y-6 text-[#5C7A6B] leading-relaxed">
          <p className="text-sm italic">Última atualização: Maio 2025</p>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">1. Responsável pelo Tratamento</h3>
            <p><strong>Lovelyproportion — Fruits Unipessoal Lda</strong></p>
            <p>NIF: 515444669</p>
            <p>Sede: Sátão, Viseu, Portugal</p>
            <p>Email: info@lovelyproportion.pt</p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">2. Dados Pessoais Recolhidos</h3>
            <p>Recolhemos os seguintes dados pessoais no âmbito da nossa atividade:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Dados de identificação:</strong> Nome completo</li>
              <li><strong>Dados de contacto:</strong> Email, telefone</li>
              <li><strong>Dados de morada:</strong> Morada de entrega, código postal, cidade</li>
              <li><strong>Dados de pagamento:</strong> Método de pagamento selecionado (não armazenamos dados bancários)</li>
              <li><strong>Dados de navegação:</strong> Cookies técnicos e de análise (anónimos)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">3. Finalidade do Tratamento</h3>
            <p>Os seus dados pessoais são tratados para as seguintes finalidades:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Processamento e gestão de encomendas</li>
              <li>Comunicação sobre o estado das encomendas</li>
              <li>Emissão de faturas e documentos de suporte fiscal</li>
              <li>Resposta a pedidos de contacto e suporte ao cliente</li>
              <li>Gestão de pedidos B2B</li>
              <li>Envio de comunicações comerciais (com consentimento prévio)</li>
              <li>Cumprimento de obrigações legais</li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">4. Base Legal</h3>
            <p>O tratamento dos seus dados pessoais baseia-se em:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Execução contratual:</strong> Para processar as suas encomendas (Art. 6.º, n.º 1, alínea b) do RGPD)</li>
              <li><strong>Consentimento:</strong> Para comunicações de marketing (Art. 6.º, n.º 1, alínea a) do RGPD)</li>
              <li><strong>Obrigação legal:</strong> Para fins fiscais e contabilísticos (Art. 6.º, n.º 1, alínea c) do RGPD)</li>
              <li><strong>Interesse legítimo:</strong> Para melhoria dos nossos serviços (Art. 6.º, n.º 1, alínea f) do RGPD)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">5. Conservação dos Dados</h3>
            <p>Os dados pessoais são conservados pelo período estritamente necessário para as finalidades que motivaram a sua recolha:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Dados de encomenda:</strong> Período necessário para cumprimento contratual + prazo legal de conservação fiscal (10 anos)</li>
              <li><strong>Dados de marketing:</strong> Até revogação do consentimento</li>
              <li><strong>Dados de navegação:</strong> 13 meses</li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">6. Direitos do Titular</h3>
            <p>Nos termos do Regulamento Geral sobre a Proteção de Dados (RGPD), tem direito a:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Acesso aos seus dados pessoais</li>
              <li>Retificação dos dados inexatos</li>
              <li>Apagamento dos dados (&quot;direito ao esquecimento&quot;)</li>
              <li>Limitação do tratamento</li>
              <li>Portabilidade dos dados</li>
              <li>Oposição ao tratamento</li>
              <li>Retirar o consentimento a qualquer momento</li>
            </ul>
            <p className="mt-2">Para exercer os seus direitos, contacte-nos através de: <strong>info@lovelyproportion.pt</strong></p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">7. Autoridade de Controlo</h3>
            <p>Se considerar que os seus dados pessoais foram tratados de forma ilícita, tem o direito de apresentar uma reclamação junto da Comissão Nacional de Proteção de Dados (CNPD):</p>
            <p className="mt-1">Website: <strong>www.cnpd.pt</strong></p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">8. Cookies</h3>
            <p>O nosso website utiliza cookies técnicos essenciais para o funcionamento do site e cookies de análise para melhoria da experiência do utilizador. Pode gerir as suas preferências de cookies a qualquer momento nas definições do navegador.</p>
          </div>
        </div>
      )

    case 'reclamacoes':
      return (
        <div className="space-y-6 text-[#5C7A6B] leading-relaxed">
          <p className="text-sm italic">Última atualização: Maio 2025</p>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">1. Livro de Reclamações Eletrónico</h3>
            <p>Nos termos da Lei n.º 144/2015, de 8 de setembro, a Lovelyproportion — Fruits Unipessoal Lda disponibiliza o Livro de Reclamações Eletrónico para registo de reclamações sobre os nossos produtos ou serviços.</p>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">2. Como Apresentar uma Reclamação</h3>
            <p>Pode apresentar a sua reclamação através das seguintes vias:</p>

            <div className="mt-4 bg-[#F0F4F0] rounded-xl p-5">
              <h4 className="font-semibold text-[#1B4332] mb-3">Online — Livro de Reclamações Eletrónico</h4>
              <p>Aceda ao portal oficial do Livro de Reclamações Eletrónico:</p>
              <p className="mt-2">
                <a
                  href="https://www.livroreclamacoes.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2D6A4F] font-semibold underline hover:text-[#40916C] transition-colors"
                >
                  www.livroreclamacoes.pt
                </a>
              </p>
            </div>

            <div className="mt-4 bg-[#F0F4F0] rounded-xl p-5">
              <h4 className="font-semibold text-[#1B4332] mb-3">Diretamente Connosco</h4>
              <p>Preferimos resolver qualquer questão diretamente. Contacte-nos:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Email:</strong> info@lovelyproportion.pt</li>
                <li><strong>Telefone:</strong> +351 232 000 000</li>
                <li><strong>Horário de atendimento:</strong> 2.ª a 6.ª-feira, das 9h00 às 18h00</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">3. Processo de Resolução</h3>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Receção:</strong> A reclamação é registada e recebe um número de referência.</li>
              <li><strong>Análise:</strong> A nossa equipa analisa a reclamação no prazo máximo de 5 dias úteis.</li>
              <li><strong>Resposta:</strong> Receberá uma resposta fundamentada no prazo máximo de 20 dias úteis.</li>
              <li><strong>Resolução:</strong> Em caso de procedência, proporemos uma solução adequada (reembolso, substituição ou compensação).</li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">4. Entidades de Resolução Alternativa de Litígios</h3>
            <p>Se não ficar satisfeito com a nossa resposta, pode recorrer aos centros de arbitragem de conflitos de consumo:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>CIAB — Centro de Informação, Mediação e Arbitragem de Conflitos de Consumo:</strong> www.ciab.pt</li>
              <li><strong>CNIACC — Centro Nacional de Informação e Arbitragem de Conflitos de Consumo:</strong> www.cniacc.pt</li>
              <li><strong>Plataforma de Resolução de Litígios em Linha da UE:</strong> <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-[#2D6A4F] underline">ec.europa.eu/consumers/odr</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#1B4332] mb-2">5. Informações Legais</h3>
            <div className="bg-[#D8F3DC] rounded-xl p-5">
              <ul className="space-y-1 text-sm">
                <li><strong>Empresa:</strong> Lovelyproportion — Fruits Unipessoal Lda</li>
                <li><strong>NIF:</strong> 515444669</li>
                <li><strong>Sede:</strong> Sátão, Viseu, Portugal</li>
                <li><strong>Registo Comercial:</strong> Conforme publicado na RCBE</li>
                <li><strong>CAE:</strong> 012 — Agricultura, produção animal, caça e atividades dos serviços relacionados</li>
              </ul>
            </div>
          </div>
        </div>
      )
  }
}

export default function PolicyDialogs() {
  const activePolicy = useUIStore((s) => s.activePolicy)
  const setActivePolicy = useUIStore((s) => s.setActivePolicy)

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setActivePolicy(null)
    }
  }

  const meta = activePolicy ? policyMeta[activePolicy] : null
  const Icon = meta?.icon

  return (
    <Dialog open={!!activePolicy} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto custom-scrollbar bg-white border-[#B7E4C7]">
        {activePolicy && meta && (
          <>
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1B4332] flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D8F3DC] rounded-full flex items-center justify-center shrink-0">
                  {Icon && <Icon className="h-5 w-5 text-[#2D6A4F]" />}
                </div>
                {meta.title}
              </DialogTitle>
            </DialogHeader>
            <Separator className="bg-[#B7E4C7] my-2" />
            <PolicyContent type={activePolicy} />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
