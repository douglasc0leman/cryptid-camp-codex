export interface CryptidCampCard {
  id: string
  name: string
  cost: number | null
  sub_text: string | null
  taxon: string | null
  attack: number | null
  defense: number | null
  advantage: string | null
  text_box: string | null
  flavor_text: string | null
  metadata: string | null
  set_name: string
  set_number: string
  illustrator: string
  image_url: string | null 
  watermark_url: string | null 
  bounty_text: string | null
  is_environment: boolean
  is_lantern: boolean
  is_special_lantern: boolean
  is_trail: boolean
  is_cryptid: boolean
  is_supply: boolean
  is_trap: boolean
  is_memory: boolean
  is_czo: boolean
  is_rare: boolean
  is_common: boolean
  is_uncommon: boolean
  is_unique: boolean
  can_be_serialized: boolean
  serialized_out_of: number | null
  is_secret_rare: boolean
  is_promo: boolean
  cabin: string | null
}
