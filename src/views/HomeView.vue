<script setup lang="ts">
import { QRCanvasFactory } from '@/misc/qrcanvas'
import { COUNTRY, CURRENCY, KHQR, TAG } from 'ts-khqr'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const khqrFrame = ref('')
const visible = ref(false)
const tagOptions = Object.entries(TAG).map(([k, v]) => ({ name: k, value: v }))
const ccyOptions = Object.entries(CURRENCY).map(([k, v]) => ({ name: k, value: v }))
const countryOptions = Object.entries(COUNTRY).map(([k, v]) => ({ name: k, value: v }))

const schema = yup.object({
  tag: yup.string().required().label('Tag'),
  accountID: yup.string().required().max(32).label('Bakong Account'),
  merchantName: yup.string().required().max(25).label('Merchant Name'),
  merchantID: yup.string().max(32).label('Merchant ID'),
  countryCode: yup.string().max(2).label('Country Code'),
  currency: yup.string().max(3).label('Currency'),
  amount: yup.number().label('Amount'),
  merchantCity: yup.string().max(15).label('Merchant City'),
  acquiringBank: yup.string().max(32).label('Acquiring Bank'),
  mobileNumber: yup.string().max(25).label('Mobile Number'),
  billNumber: yup.string().max(25).label('Bill Number'),
  storeLabel: yup.string().max(25).label('Store Label'),
  terminalLabel: yup.string().max(25).label('Terminal Label'),
  purposeOfTransaction: yup.string().max(25).label('Remark'),
  languagePreference: yup.string().max(2).label('Language Preference'),
  merchantNameAlternateLanguage: yup.string().max(25).label('Merchant Name Alternate Language'),
  merchantCityAlternateLanguage: yup.string().max(15).label('Merchant City Alternate Language'),
  upiMerchantAccount: yup.string().max(99).label('UPI Merchant Account')
})

const { defineComponentBinds, handleSubmit, resetForm, errors, meta } = useForm({
  initialValues: {
    tag: TAG.INDIVIDUAL,
    accountID: '',
    merchantName: '',
    merchantID: '',
    countryCode: COUNTRY.KH,
    currency: CURRENCY.KHR,
    amount: 0,
    merchantCity: 'Phnom Penh',
    acquiringBank: '',
    mobileNumber: '',
    billNumber: '',
    storeLabel: '',
    terminalLabel: '',
    purposeOfTransaction: '',
    languagePreference: '',
    merchantNameAlternateLanguage: '',
    merchantCityAlternateLanguage: '',
    upiMerchantAccount: ''
  },
  validationSchema: schema
})

const tag = defineComponentBinds('tag')
const accountID = defineComponentBinds('accountID')
const merchantName = defineComponentBinds('merchantName')
const merchantID = defineComponentBinds('merchantID')
const countryCode = defineComponentBinds('countryCode')
const currency = defineComponentBinds('currency')
const amount = defineComponentBinds('amount')
const merchantCity = defineComponentBinds('merchantCity')
const acquiringBank = defineComponentBinds('acquiringBank')
const mobileNumber = defineComponentBinds('mobileNumber')
const billNumber = defineComponentBinds('billNumber')
const storeLabel = defineComponentBinds('storeLabel')
const terminalLabel = defineComponentBinds('terminalLabel')
const purposeOfTransaction = defineComponentBinds('purposeOfTransaction')
const languagePreference = defineComponentBinds('languagePreference')
const merchantNameAlternateLanguage = defineComponentBinds('merchantNameAlternateLanguage')
const merchantCityAlternateLanguage = defineComponentBinds('merchantCityAlternateLanguage')
const upiMerchantAccount = defineComponentBinds('upiMerchantAccount')
const ccy = computed(() => currency.value.modelValue)

const onSubmit = handleSubmit(async (values) => {
  const result = KHQR.generate({
    tag: values.tag,
    accountID: values.accountID,
    merchantName: values.merchantName,
    // optional
    merchantID: values.merchantID,
    acquiringBank: values.acquiringBank,
    merchantCity: values.merchantCity,
    currency: values.currency,
    amount: values.amount,
    countryCode: values.countryCode,
    additionalData: {
      mobileNumber: values.mobileNumber,
      billNumber: values.billNumber,
      storeLabel: values.storeLabel,
      terminalLabel: values.terminalLabel,
      purposeOfTransaction: values.purposeOfTransaction
    },
    languageData: {
      languagePreference: values.languagePreference,
      merchantNameAlternateLanguage: values.merchantNameAlternateLanguage,
      merchantCityAlternateLanguage: values.merchantCityAlternateLanguage
    },
    upiMerchantAccount: values.upiMerchantAccount
  })

  if (result.data) {
    const qrCanvas = new QRCanvasFactory(
      result.data,
      values.currency,
      values.merchantName,
      values.accountID
    )
    khqrFrame.value = await qrCanvas.createQR()
    visible.value = true
  } else if (result.status && result.status.code === 1) {
    toast.add({ severity: 'error', summary: 'Error', detail: result.status.message, life: 3000 })
  }
})

const onDownload = () => {
  if (!khqrFrame.value) return
  const link = document.createElement('a')
  link.download = `${merchantName.value.modelValue.replace(/\s/g, '')}.png`
  link.href = khqrFrame.value
  link.click()
  link.remove()
}

const onClose = () => {
  khqrFrame.value = ''
  visible.value = false
}
</script>

<template>
  <VCard>
    <template #content>
      <form @submit="onSubmit" class="flex flex-column gap-2 w-full">
        <div class="field">
          <span class="p-float-label">
            <VDropdown
              v-bind="tag"
              :options="tagOptions"
              optionLabel="name"
              optionValue="value"
              :class="{ 'p-invalid': errors.tag }"
              class="w-full"
            />
            <label>Tag</label>
          </span>
          <small id="tag" class="p-error">{{ errors.tag }}</small>
        </div>

        <div class="flex justify-content-between">
          <div class="field w-full">
            <span class="p-float-label">
              <VDropdown
                v-bind="countryCode"
                :options="countryOptions"
                optionLabel="name"
                optionValue="value"
                :class="{ 'p-invalid': errors.countryCode }"
                class="w-full"
              />
              <label>Country Code</label>
            </span>
            <small id="countryCode" class="p-error">{{ errors.countryCode }}</small>
          </div>
          &nbsp;
          <div class="field w-full">
            <span class="p-float-label">
              <VDropdown
                v-bind="currency"
                :options="ccyOptions"
                optionLabel="name"
                optionValue="value"
                :class="{ 'p-invalid': errors.currency }"
                class="w-full"
              />
              <label>Currency</label>
            </span>
            <small id="currency" class="p-error">{{ errors.currency }}</small>
          </div>
        </div>

        <div class="flex justify-content-between">
          <div class="field w-full">
            <span class="p-float-label">
              <VInputText
                id="accountID"
                v-bind="accountID"
                :class="{ 'p-invalid': errors.accountID }"
                class="w-full"
              />
              <label for="accountID">Bakong Account</label>
            </span>
            <small id="accountID" class="p-error">{{ errors.accountID }}</small>
          </div>
          &nbsp;
          <div class="field w-full">
            <span class="p-float-label">
              <VInputText
                id="merchantName"
                v-bind="merchantName"
                :class="{ 'p-invalid': errors.merchantName }"
                class="w-full"
              />
              <label for="merchantName">Merchant Name</label>
            </span>
            <small id="merchantName" class="p-error">{{ errors.merchantName }}</small>
          </div>
        </div>

        <div class="flex justify-content-between">
          <div class="field w-full">
            <span class="p-float-label">
              <VInputText
                id="merchantID"
                v-bind="merchantID"
                :class="{ 'p-invalid': errors.merchantID }"
                class="w-full"
              />
              <label for="merchantID">Merchant ID</label>
            </span>
            <small id="merchantID" class="p-error">{{ errors.merchantID }}</small>
          </div>
          &nbsp;
          <div class="field w-full">
            <span class="p-float-label">
              <VInputText
                id="merchantCity"
                v-bind="merchantCity"
                :class="{ 'p-invalid': errors.merchantCity }"
                class="w-full"
              />
              <label for="merchantCity">Merchant City</label>
            </span>
            <small id="merchantCity" class="p-error">{{ errors.merchantCity }}</small>
          </div>
        </div>

        <div class="flex justify-content-between">
          <div class="field w-full">
            <span class="p-float-label">
              <VInputText
                id="acquiringBank"
                v-bind="acquiringBank"
                :class="{ 'p-invalid': errors.acquiringBank }"
                class="w-full"
              />
              <label for="acquiringBank">Acquiring Bank</label>
            </span>
            <small id="acquiringBank" class="p-error">{{ errors.acquiringBank }}</small>
          </div>
          &nbsp;
          <div class="field w-full">
            <span class="p-float-label">
              <VInputText
                id="upiMerchantAccount"
                v-bind="upiMerchantAccount"
                :class="{ 'p-invalid': errors.upiMerchantAccount }"
                class="w-full"
              />
              <label for="upiMerchantAccount">UPI Merchant Account</label>
            </span>
            <small id="upiMerchantAccount" class="p-error">
              {{ errors.upiMerchantAccount }}
            </small>
          </div>
        </div>

        <div class="field">
          <span class="p-float-label">
            <VInputNumber
              id="amount"
              v-bind="amount"
              :minFractionDigits="ccy !== CURRENCY.KHR ? 2 : undefined"
              :maxFractionDigits="ccy !== CURRENCY.KHR ? 2 : undefined"
              :class="{ 'p-invalid': errors.amount }"
              class="w-full"
            />
            <label>Amount</label>
          </span>
          <small id="amount" class="p-error">{{ errors.amount }}</small>
        </div>

        <VAccordion :multiple="true">
          <VAccordionTab header="Additional Data">
            <div class="flex flex-column gap-2 pt-2">
              <div class="field">
                <span class="p-float-label">
                  <VInputText
                    id="mobileNumber"
                    v-bind="mobileNumber"
                    :class="{ 'p-invalid': errors.mobileNumber }"
                    class="w-full"
                  />
                  <label for="mobileNumber">Mobile Number</label>
                </span>
                <small id="mobileNumber" class="p-error">{{ errors.mobileNumber }}</small>
              </div>

              <div class="field">
                <span class="p-float-label">
                  <VInputText
                    id="billNumber"
                    v-bind="billNumber"
                    :class="{ 'p-invalid': errors.billNumber }"
                    class="w-full"
                  />
                  <label for="billNumber">Bill Number</label>
                </span>
                <small id="billNumber" class="p-error">{{ errors.billNumber }}</small>
              </div>

              <div class="field">
                <span class="p-float-label">
                  <VInputText
                    id="storeLabel"
                    v-bind="storeLabel"
                    :class="{ 'p-invalid': errors.storeLabel }"
                    class="w-full"
                  />
                  <label for="storeLabel">Store Label</label>
                </span>
                <small id="storeLabel" class="p-error">{{ errors.storeLabel }}</small>
              </div>

              <div class="field">
                <span class="p-float-label">
                  <VInputText
                    id="terminalLabel"
                    v-bind="terminalLabel"
                    :class="{ 'p-invalid': errors.terminalLabel }"
                    class="w-full"
                  />
                  <label for="terminalLabel">Terminal Label</label>
                </span>
                <small id="terminalLabel" class="p-error">{{ errors.terminalLabel }}</small>
              </div>

              <div class="field">
                <span class="p-float-label">
                  <VInputText
                    id="purposeOfTransaction"
                    v-bind="purposeOfTransaction"
                    :class="{ 'p-invalid': errors.purposeOfTransaction }"
                    class="w-full"
                  />
                  <label for="purposeOfTransaction">Remark</label>
                </span>
                <small id="purposeOfTransaction" class="p-error">
                  {{ errors.purposeOfTransaction }}
                </small>
              </div>
            </div>
          </VAccordionTab>
          <VAccordionTab header="Language Data">
            <div class="flex flex-column gap-2 pt-2">
              <div class="field">
                <span class="p-float-label">
                  <VInputText
                    id="languagePreference"
                    v-bind="languagePreference"
                    :class="{ 'p-invalid': errors.languagePreference }"
                    class="w-full"
                  />
                  <label for="languagePreference">Language Preference</label>
                </span>
                <small id="languagePreference" class="p-error">
                  {{ errors.languagePreference }}
                </small>
              </div>

              <div class="field">
                <span class="p-float-label">
                  <VInputText
                    id="merchantNameAlternateLanguage"
                    v-bind="merchantNameAlternateLanguage"
                    :class="{ 'p-invalid': errors.merchantNameAlternateLanguage }"
                    class="w-full"
                  />
                  <label for="merchantNameAlternateLanguage">
                    Merchant Name Alternate Language
                  </label>
                </span>
                <small id="merchantNameAlternateLanguage" class="p-error">
                  {{ errors.merchantNameAlternateLanguage }}
                </small>
              </div>

              <div class="field">
                <span class="p-float-label">
                  <VInputText
                    id="merchantCityAlternateLanguage"
                    v-bind="merchantCityAlternateLanguage"
                    :class="{ 'p-invalid': errors.merchantCityAlternateLanguage }"
                    class="w-full"
                  />
                  <label for="merchantCityAlternateLanguage">
                    Merchant City Alternate Language
                  </label>
                </span>
                <small id="merchantCityAlternateLanguage" class="p-error">
                  {{ errors.merchantCityAlternateLanguage }}
                </small>
              </div>
            </div>
          </VAccordionTab>
        </VAccordion>

        <div class="flex justify-content-center pt-4">
          <VButton type="submit" label="Generate" :disabled="!meta.valid" />
          &nbsp;
          <VButton
            label="Reset"
            type="button"
            @click="() => resetForm()"
            class="p-button-outlined"
          />
        </div>
      </form>
    </template>
  </VCard>

  <VDialog
    v-model:visible="visible"
    :closable="false"
    :draggable="false"
    modal
    header="Get your QR"
    :style="{ width: '350px' }"
  >
    <div class="flex justify-content-center">
      <div style="width: 100%">
        <img :src="khqrFrame" style="max-width: 100%" />
      </div>
    </div>
    <template #footer>
      <VButton label="Download" icon="pi pi-download" @click="onDownload" :disabled="!khqrFrame" />
      <VButton label="Close" class="p-button-outlined" icon="pi pi-times" @click="onClose" />
    </template>
  </VDialog>

  <VToast position="bottom-center" />
</template>
