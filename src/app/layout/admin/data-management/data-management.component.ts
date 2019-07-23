import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DataManagementService } from '../../../shared/config/service/admin/dataManagement.service';
import { NoDaysRequiremets } from '../../../shared/config/model/admin/no-days-requirements.model';
import { UnadjustedDailyRequirements } from '../../../shared/config/model/admin/unasjusted-daily-requirements.model';
import { BranchDailyMinimalCapacity } from '../../../shared/config/model/admin/branch-daily-minimal-capacity.model';
import { error } from '@angular/compiler/src/util';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.css']
})
export class DataManagementComponent implements OnInit {

  dataManagementForm: FormGroup;
  noDaysRequirementsForm: FormGroup;
  unadjastedDailyRequirementsForm: FormGroup;
  branchDailyMinimalCapacityForm: FormGroup;
  NoDaysRequiremetsOb: NoDaysRequiremets;
  UnadjustedDailyRequirementsOb: UnadjustedDailyRequirements;
  branchDailyMinimalCapacityOb: BranchDailyMinimalCapacity;
  nationalRegTotalValue = 0;
  totalMinCapacityvalue = 0;
  totalStaticCbdValue = 0;
  util;

  constructor(private fb: FormBuilder, private  dataService: DataManagementService, private snotify: SnotifyService) { }

  ngOnInit() {
    this.noDaysRequirements();
    this.unadjastedDailyRequirements();
    this.branchDailyMinimalCapacity();
    this.getNoDaysRequirements();
    this.getBranchDailyMinimalCapacity();
    this.getnadjastedDailyRequirements();
    this.util = new NotifyUtil(this.snotify);

  }


  noDaysRequirements() {
    this.noDaysRequirementsForm = this.fb.group({
      id: new FormControl(),
      timeCreated: new FormControl(),
      dateCreated: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      harareOplus: new FormControl(),
      harareOminus: new FormControl(),
      harareAplus: new FormControl(),
      harareBplus: new FormControl(),
      harareTotal: new FormControl(),
      harareNationalPercentage: new FormControl(),
      bulawayoOplus: new FormControl(),
      bulawayoOminus: new FormControl(),
      bulawayoAplus: new FormControl(),
      bulawayoBplus: new FormControl(),
      bulawayoTotal: new FormControl(),
      bulawayoNationalPercentage: new FormControl(),
      gweruOplus: new FormControl(),
      gweruOminus: new FormControl(),
      gweruAplus: new FormControl(),
      gweruBplus: new FormControl(),
      gweruTotal: new FormControl(),
      gweruNationalPercentage: new FormControl(),
      mutareOplus: new FormControl(),
      mutareOminus: new FormControl(),
      mutareAplus: new FormControl(),
      mutareBplus: new FormControl(),
      mutareTotal: new FormControl(),
      mutareNationalPercentage: new FormControl(),
      masvingoOplus: new FormControl(),
      masvingoOminus: new FormControl(),
      masvingoAplus: new FormControl(),
      masvingoBplus: new FormControl(),
      masvingoTotal: new FormControl(),
      masvingoNationalPercentage: new FormControl(),
      nationalRequirementsOplus: new FormControl(),
      nationalRequirementsOminus: new FormControl(),
      nationalRequirementsAplus: new FormControl(),
      nationalRequirementsBplus: new FormControl(),
      nationalRequirementsTotal: new FormControl(),
      nationalRequirementsNationalPercentage: new FormControl(),
    });
  }

  sumDaysReqOplus(value) {
    let total = 0;
    total = Number(value.harareOplus) + Number(value.bulawayoOplus) + Number(value.gweruOplus) +
            Number(value.mutareOplus) + Number(value.masvingoOplus);
    this.noDaysRequirementsForm.get('nationalRequirementsOplus').setValue(total);
  }
  sumDaysReqOminus(value) {
    let total = 0;
    total = Number(value.harareOminus) + Number(value.bulawayoOminus) + Number(value.gweruOminus) +
            Number(value.mutareOminus) + Number(value.masvingoOminus);
    this.noDaysRequirementsForm.get('nationalRequirementsOminus').setValue(total);
  }
  sumDaysReqAplus(value) {
    let total = 0;
    total = Number(value.harareAplus) + Number(value.bulawayoAplus) + Number(value.gweruAplus) +
            Number(value.mutareAplus) + Number(value.masvingoAplus);
    this.noDaysRequirementsForm.get('nationalRequirementsAplus').setValue(total);
  }
  sumDaysReqBplus(value) {
    let total = 0;
    total = Number(value.harareBplus) + Number(value.bulawayoBplus) + Number(value.gweruBplus) +
            Number(value.mutareBplus) + Number(value.masvingoBplus);
    this.noDaysRequirementsForm.get('nationalRequirementsBplus').setValue(total);
  }



  sumDaysReqTotal(value, present?, totalToUse?): number {
    let total = 0;
    total = Number(value.harareTotal) + Number(value.bulawayoTotal) + Number(value.gweruTotal) +
            Number(value.mutareTotal) + Number(value.masvingoTotal) + present;
              // + value.nationalRequirementsTotal;
    this.noDaysRequirementsForm.get('nationalRequirementsTotal').setValue(total);
    this.noDaysRequirementsForm.get('harareNationalPercentage').setValue( Math.round((value.harareTotal  / total) * 100));
    this.noDaysRequirementsForm.get('bulawayoNationalPercentage').setValue( Math.round((value.bulawayoTotal  / total) * 100));
    this.noDaysRequirementsForm.get('gweruNationalPercentage').setValue( Math.round((value.gweruTotal  / total) * 100));
    this.noDaysRequirementsForm.get('mutareNationalPercentage').setValue( Math.round((value.mutareTotal  / total) * 100));
    this.noDaysRequirementsForm.get('masvingoNationalPercentage').setValue( Math.round((value.masvingoTotal  / total) * 100));
    return total;
  }

  sumDaysReqHarare(value) {
    let total = 0;
    total = Number(value.harareOplus) + Number(value.harareOminus) + Number(value.harareAplus) + Number(value.harareBplus);
    this.noDaysRequirementsForm.get('harareTotal').setValue(total);
    const natTotal = this.sumDaysReqTotal(value, total - Number(value.harareTotal), total);
    this.noDaysRequirementsForm.get('harareNationalPercentage').setValue( Math.round((total  / natTotal) * 100));
    this.branchDailyMinimalCapacityForm.get('harareTotalMinCapacity').setValue(total);

    // this.sumDaysReqBulawayo(value);
  }
  sumDaysReqBulawayo(value) {
    let total = 0;
    total = Number(value.bulawayoOplus) + Number(value.bulawayoOminus) + Number(value.bulawayoAplus) + Number(value.bulawayoBplus);
    this.noDaysRequirementsForm.get('bulawayoTotal').setValue(total);
    const natTotal = this.sumDaysReqTotal(value, total - Number(value.bulawayoTotal));
    this.noDaysRequirementsForm.get('bulawayoNationalPercentage').setValue( Math.round((total  / natTotal) * 100));

    // this.sumDaysReqHarare(value);
  }
  sumDaysReqGweru(value) {
    let total = 0;
    total = Number(value.gweruOplus) + Number(value.gweruOminus) + Number(value.gweruAplus) + value.gweruBplus;
    this.noDaysRequirementsForm.get('gweruTotal').setValue(total);
    const natTotal = this.sumDaysReqTotal(value, total - value.gweruTotal);
    this.noDaysRequirementsForm.get('gweruNationalPercentage').setValue( Math.round((total  / natTotal) * 100));
  }
  sumDaysReqMutare(value) {
    let total = 0;
    total = Number(value.mutareOplus) + Number(value.mutareOminus) + Number(value.mutareAplus) + Number(value.mutareBplus);
    this.noDaysRequirementsForm.get('mutareTotal').setValue(total);
    const natTotal = this.sumDaysReqTotal(value, total - Number(value.mutareTotal));
    this.noDaysRequirementsForm.get('mutareNationalPercentage').setValue( Math.round((total  / natTotal) * 100));
  }
  sumDaysReqMasvingo(value) {
    let total = 0;
    total = Number(value.masvingoOplus) + Number(value.masvingoOminus) + Number(value.masvingoAplus) + Number(value.masvingoBplus);
    this.noDaysRequirementsForm.get('masvingoTotal').setValue(total);
    const natTotal = this.sumDaysReqTotal(value, total - Number(value.masvingoTotal));
    this.noDaysRequirementsForm.get('masvingoNationalPercentage').setValue( Math.round((total  / natTotal) * 100));
  }



  unadjastedDailyRequirements() {
    this.unadjastedDailyRequirementsForm = this.fb.group({
      id: new FormControl(),
      timeCreated: new FormControl(),
      dateCreated: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      oPlusHarare: new FormControl(),
      oMinusHarare: new FormControl(),
      aPlusHarare: new FormControl(),
      aMinusHarare: new FormControl(),
      bPlusHarare: new FormControl(),
      bMinusHarare: new FormControl(),
      abPlusHarare: new FormControl(),
      abMinusHarare: new FormControl(),
      totalHarare: new FormControl(),
      oPlusBulawayo: new FormControl(),
      oMinusBulawayo: new FormControl(),
      aPlusBulawayo: new FormControl(),
      aMinusBulawayo: new FormControl(),
      bPlusBulawayo: new FormControl(),
      bMinusBulawayo: new FormControl(),
      abPlusBulawayo: new FormControl(),
      abMinusBulawayo: new FormControl(),
      totalBulawayo: new FormControl(),
      oPlusGweru: new FormControl(),
      oMinusGweru: new FormControl(),
      aPlusGweru: new FormControl(),
      aMinusGweru: new FormControl(),
      bPlusGweru: new FormControl(),
      bMinusGweru: new FormControl(),
      abPlusGweru: new FormControl(),
      abMinusGweru: new FormControl(),
      totalGweru: new FormControl(),
      oPlusMutare: new FormControl(),
      oMinusMutare: new FormControl(),
      aPlusMutare: new FormControl(),
      aMinusMutare: new FormControl(),
      bPlusMutare: new FormControl(),
      bMinusMutare: new FormControl(),
      abPlusMutare: new FormControl(),
      abMinusMutare: new FormControl(),
      totalMutare: new FormControl(),
      oPlusMasvingo: new FormControl(),
      oMinusMasvingo: new FormControl(),
      aPlusMasvingo: new FormControl(),
      aMinusMasvingo: new FormControl(),
      bPlusMasvingo: new FormControl(),
      bMinusMasvingo: new FormControl(),
      abPlusMasvingo: new FormControl(),
      abMinusMasvingo: new FormControl(),
      totalMasvingo: new FormControl(),
      oPlusTotalDailyRequirements: new FormControl(),
      oMinusTotalDailyRequirements: new FormControl(),
      aPlusTotalDailyRequirements: new FormControl(),
      aMinusTotalDailyRequirements: new FormControl(),
      bPlusTotalDailyRequirements: new FormControl(),
      bMinusTotalDailyRequirements: new FormControl(),
      abPlusTotalDailyRequirements: new FormControl(),
      abMinusTotalDailyRequirements: new FormControl(),
      totalTotalDailyRequirements: new FormControl(),
    });
  }

  branchDailyMinimalCapacity() {
    this.branchDailyMinimalCapacityForm = this.fb.group({
      id: new FormControl(),
      timeCreated: new FormControl(),
      dateCreated: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      harareStaticCbd: new FormControl(),
      harareMob1: new FormControl(),
      harareMob2: new FormControl(),
      harareMob3: new FormControl(),
      harareTotalMinCapacity: new FormControl(),
      harareExpectedDailyCollections: new FormControl(),
      hararePercentageCapacity: new FormControl(),
      bulawayoStaticCbd: new FormControl(),
      bulawayoMob1: new FormControl(),
      bulawayoMob2: new FormControl(),
      bulawayoMob3: new FormControl(),
      bulawayoTotalMinCapacity: new FormControl(),
      bulawayoExpectedDailyCollections: new FormControl(),
      bulawayoPercentageCapacity: new FormControl(),
      gweruStaticCbd: new FormControl(),
      gweruMob1: new FormControl(),
      gweruMob2: new FormControl(),
      gweruMob3: new FormControl(),
      gweruTotalMinCapacity: new FormControl(),
      gweruExpectedDailyCollections: new FormControl(),
      gweruPercentageCapacity: new FormControl(),
      mutareStaticCbd: new FormControl(),
      mutareMob1: new FormControl(),
      mutareMob2: new FormControl(),
      mutareMob3: new FormControl(),
      mutareTotalMinCapacity: new FormControl(),
      mutareExpectedDailyCollections: new FormControl(),
      mutarePercentageCapacity: new FormControl(),
      masvingoStaticCbd: new FormControl(),
      masvingoMob1: new FormControl(),
      masvingoMob2: new FormControl(),
      masvingoMob3: new FormControl(),
      masvingoTotalMinCapacity: new FormControl(),
      masvingoExpectedDailyCollections: new FormControl(),
      masvingoPercentageCapacity: new FormControl(),
      totalStaticCbd: new FormControl(),
      totalMob1: new FormControl(),
      totalMob2: new FormControl(),
      totalMob3: new FormControl(),
      totalTotalMinCapacity: new FormControl(),
      totalExDailyCollections: new FormControl(),
      totalPercentageCapacity: new FormControl(),
      fixedPercentage: new FormControl(),
      mobPercentage: new FormControl(),
    });
  }

  getNoDaysRequirements() {
    this.dataService.getNoDaysRequiremets().subscribe(
      result => {
        this.NoDaysRequiremetsOb = result;
        if (this.NoDaysRequiremetsOb !== null && this.NoDaysRequiremetsOb !== undefined) {
        this.populateNDReq(this.NoDaysRequiremetsOb);
        this.totalMinCap(this.NoDaysRequiremetsOb);
        }
      },
      error => {
        console.log(error.error);
      },
      () => {
      }
    );
  }

  saveNoDaysRequirements(value) {
    this.dataService.saveNoDaysRequiremets(value).subscribe(
      result => {
        this.snotify.success(result.message, 'Success', this.util.getNotifyConfig());
      },
      error => {
        this.snotify.error(error.error, 'Error', this.util.getNotifyConfig());
      },
      () => {
        this.getNoDaysRequirements();
      }
    );
  }
  clearNoDaysRequirements() {
    this.noDaysRequirementsForm.get('harareOplus').setValue('');
    this.noDaysRequirementsForm.get('harareOminus').setValue('');
    this.noDaysRequirementsForm.get('harareAplus').setValue('');
    this.noDaysRequirementsForm.get('harareBplus').setValue('');
    this.noDaysRequirementsForm.get('harareTotal').setValue('');
    this.noDaysRequirementsForm.get('harareNationalPercentage').setValue('');
    this.noDaysRequirementsForm.get('bulawayoOplus').setValue('');
    this.noDaysRequirementsForm.get('bulawayoOminus').setValue('');
    this.noDaysRequirementsForm.get('bulawayoAplus').setValue('');
    this.noDaysRequirementsForm.get('bulawayoBplus').setValue('');
    this.noDaysRequirementsForm.get('bulawayoTotal').setValue('');
    this.noDaysRequirementsForm.get('bulawayoNationalPercentage').setValue('');
    this.noDaysRequirementsForm.get('gweruOplus').setValue('');
    this.noDaysRequirementsForm.get('gweruOminus').setValue('');
    this.noDaysRequirementsForm.get('gweruAplus').setValue('');
    this.noDaysRequirementsForm.get('gweruBplus').setValue('');
    this.noDaysRequirementsForm.get('gweruTotal').setValue('');
    this.noDaysRequirementsForm.get('gweruNationalPercentage').setValue('');
    this.noDaysRequirementsForm.get('mutareOplus').setValue('');
    this.noDaysRequirementsForm.get('mutareOminus').setValue('');
    this.noDaysRequirementsForm.get('mutareAplus').setValue('');
    this.noDaysRequirementsForm.get('mutareBplus').setValue('');
    this.noDaysRequirementsForm.get('mutareTotal').setValue('');
    this.noDaysRequirementsForm.get('mutareNationalPercentage').setValue('');
    this.noDaysRequirementsForm.get('masvingoOplus').setValue('');
    this.noDaysRequirementsForm.get('masvingoOminus').setValue('');
    this.noDaysRequirementsForm.get('masvingoAplus').setValue('');
    this.noDaysRequirementsForm.get('masvingoBplus').setValue('');
    this.noDaysRequirementsForm.get('masvingoTotal').setValue('');
    this.noDaysRequirementsForm.get('masvingoNationalPercentage').setValue('');
    this.noDaysRequirementsForm.get('nationalRequirementsOplus').setValue('');
    this.noDaysRequirementsForm.get('nationalRequirementsOminus').setValue('');
    this.noDaysRequirementsForm.get('nationalRequirementsAplus').setValue('');
    this.noDaysRequirementsForm.get('nationalRequirementsBplus').setValue('');
    this.noDaysRequirementsForm.get('nationalRequirementsTotal').setValue('');
    this.noDaysRequirementsForm.get('nationalRequirementsNationalPercentage').setValue('');
  }
  populateNDReq(NoDaysRequiremetsOb: NoDaysRequiremets) {
    this.noDaysRequirementsForm.get('id').setValue(NoDaysRequiremetsOb.id);
    this.noDaysRequirementsForm.get('dateCreated').setValue(NoDaysRequiremetsOb.dateCreated);
    this.noDaysRequirementsForm.get('version').setValue(NoDaysRequiremetsOb.version);
    this.noDaysRequirementsForm.get('createdById').setValue(NoDaysRequiremetsOb.createdById);
    this.noDaysRequirementsForm.get('harareOplus').setValue(NoDaysRequiremetsOb.harareOplus);
    this.noDaysRequirementsForm.get('harareOminus').setValue(NoDaysRequiremetsOb.harareOminus);
    this.noDaysRequirementsForm.get('harareAplus').setValue(NoDaysRequiremetsOb.harareAplus);
    this.noDaysRequirementsForm.get('harareBplus').setValue(NoDaysRequiremetsOb.harareBplus);
    this.noDaysRequirementsForm.get('harareTotal').setValue(NoDaysRequiremetsOb.harareTotal);
    this.noDaysRequirementsForm.get('harareNationalPercentage').setValue(NoDaysRequiremetsOb.harareNationalPercentage);
    this.noDaysRequirementsForm.get('bulawayoOplus').setValue(NoDaysRequiremetsOb.bulawayoOplus);
    this.noDaysRequirementsForm.get('bulawayoOminus').setValue(NoDaysRequiremetsOb.bulawayoOminus);
    this.noDaysRequirementsForm.get('bulawayoAplus').setValue(NoDaysRequiremetsOb.bulawayoAplus);
    this.noDaysRequirementsForm.get('bulawayoBplus').setValue(NoDaysRequiremetsOb.bulawayoBplus);
    this.noDaysRequirementsForm.get('bulawayoTotal').setValue(NoDaysRequiremetsOb.bulawayoTotal);
    this.noDaysRequirementsForm.get('bulawayoNationalPercentage').setValue(NoDaysRequiremetsOb.bulawayoNationalPercentage);
    this.noDaysRequirementsForm.get('gweruOplus').setValue(NoDaysRequiremetsOb.gweruOplus);
    this.noDaysRequirementsForm.get('gweruOminus').setValue(NoDaysRequiremetsOb.gweruOminus);
    this.noDaysRequirementsForm.get('gweruAplus').setValue(NoDaysRequiremetsOb.gweruAplus);
    this.noDaysRequirementsForm.get('gweruBplus').setValue(NoDaysRequiremetsOb.gweruBplus);
    this.noDaysRequirementsForm.get('gweruTotal').setValue(NoDaysRequiremetsOb.gweruTotal);
    this.noDaysRequirementsForm.get('gweruNationalPercentage').setValue(NoDaysRequiremetsOb.gweruNationalPercentage);
    this.noDaysRequirementsForm.get('mutareOplus').setValue(NoDaysRequiremetsOb.mutareOplus);
    this.noDaysRequirementsForm.get('mutareOminus').setValue(NoDaysRequiremetsOb.mutareOminus);
    this.noDaysRequirementsForm.get('mutareAplus').setValue(NoDaysRequiremetsOb.mutareAplus);
    this.noDaysRequirementsForm.get('mutareBplus').setValue(NoDaysRequiremetsOb.mutareBplus);
    this.noDaysRequirementsForm.get('mutareTotal').setValue(NoDaysRequiremetsOb.mutareTotal);
    this.noDaysRequirementsForm.get('mutareNationalPercentage').setValue(NoDaysRequiremetsOb.mutareNationalPercentage);
    this.noDaysRequirementsForm.get('masvingoOplus').setValue(NoDaysRequiremetsOb.masvingoOplus);
    this.noDaysRequirementsForm.get('masvingoOminus').setValue(NoDaysRequiremetsOb.masvingoOminus);
    this.noDaysRequirementsForm.get('masvingoAplus').setValue(NoDaysRequiremetsOb.masvingoAplus);
    this.noDaysRequirementsForm.get('masvingoBplus').setValue(NoDaysRequiremetsOb.masvingoBplus);
    this.noDaysRequirementsForm.get('masvingoTotal').setValue(NoDaysRequiremetsOb.masvingoTotal);
    this.noDaysRequirementsForm.get('masvingoNationalPercentage').setValue(NoDaysRequiremetsOb.masvingoNationalPercentage);
    this.noDaysRequirementsForm.get('nationalRequirementsOplus').setValue(NoDaysRequiremetsOb.nationalRequirementsOplus);
    this.noDaysRequirementsForm.get('nationalRequirementsOminus').setValue(NoDaysRequiremetsOb.nationalRequirementsOminus);
    this.noDaysRequirementsForm.get('nationalRequirementsAplus').setValue(NoDaysRequiremetsOb.nationalRequirementsAplus);
    this.noDaysRequirementsForm.get('nationalRequirementsBplus').setValue(NoDaysRequiremetsOb.nationalRequirementsBplus);
    this.noDaysRequirementsForm.get('nationalRequirementsTotal').setValue(NoDaysRequiremetsOb.nationalRequirementsTotal);
    this.noDaysRequirementsForm.get('nationalRequirementsNationalPercentage').setValue(NoDaysRequiremetsOb.nationalRequirementsNationalPercentage);
  }

  getnadjastedDailyRequirements() {
    this.dataService.getUnadjustedDailyRequirements().subscribe(
      result => {
        this.UnadjustedDailyRequirementsOb = result;
        if (this.UnadjustedDailyRequirementsOb !== null && this.UnadjustedDailyRequirementsOb !== undefined) {
          this.populateUADReq(this.UnadjustedDailyRequirementsOb);
        }
      },
      error => {
        console.log(error.error);
      },
      () => {
      }
    );
  }

  saveUnadjastedDailyRequirements(value) {
    this.dataService.saveUnadjustedDailyRequirements(value).subscribe(
      result => {
        this.snotify.success(result.message, 'Success', this.util.getNotifyConfig());
      },
      error => {
        // console.log(error.error);
        this.snotify.error(error.error, 'Error', this.util.getNotifyConfig());
      },
      () => {
        this.getnadjastedDailyRequirements();
      }
    );
  }
  clearUnadjastedDailyRequirements() {
    this.unadjastedDailyRequirementsForm.get('oPlusHarare').setValue('');
    this.unadjastedDailyRequirementsForm.get('oMinusHarare').setValue('');
    this.unadjastedDailyRequirementsForm.get('aPlusHarare').setValue('');
    this.unadjastedDailyRequirementsForm.get('aMinusHarare').setValue('');
    this.unadjastedDailyRequirementsForm.get('bPlusHarare').setValue('');
    this.unadjastedDailyRequirementsForm.get('bMinusHarare').setValue('');
    this.unadjastedDailyRequirementsForm.get('abPlusHarare').setValue('');
    this.unadjastedDailyRequirementsForm.get('abMinusHarare').setValue('');
    this.unadjastedDailyRequirementsForm.get('totalHarare').setValue('');
    this.unadjastedDailyRequirementsForm.get('oPlusBulawayo').setValue('');
    this.unadjastedDailyRequirementsForm.get('oMinusBulawayo').setValue('');
    this.unadjastedDailyRequirementsForm.get('aPlusBulawayo').setValue('');
    this.unadjastedDailyRequirementsForm.get('aMinusBulawayo').setValue('');
    this.unadjastedDailyRequirementsForm.get('bPlusBulawayo').setValue('');
    this.unadjastedDailyRequirementsForm.get('bMinusBulawayo').setValue('');
    this.unadjastedDailyRequirementsForm.get('abPlusBulawayo').setValue('');
    this.unadjastedDailyRequirementsForm.get('abMinusBulawayo').setValue('');
    this.unadjastedDailyRequirementsForm.get('totalBulawayo').setValue('');
    this.unadjastedDailyRequirementsForm.get('oPlusGweru').setValue('');
    this.unadjastedDailyRequirementsForm.get('oMinusGweru').setValue('');
    this.unadjastedDailyRequirementsForm.get('aPlusGweru').setValue('');
    this.unadjastedDailyRequirementsForm.get('aMinusGweru').setValue('');
    this.unadjastedDailyRequirementsForm.get('bPlusGweru').setValue('');
    this.unadjastedDailyRequirementsForm.get('bMinusGweru').setValue('');
    this.unadjastedDailyRequirementsForm.get('abPlusGweru').setValue('');
    this.unadjastedDailyRequirementsForm.get('abMinusGweru').setValue('');
    this.unadjastedDailyRequirementsForm.get('totalGweru').setValue('');
    this.unadjastedDailyRequirementsForm.get('oPlusMutare').setValue('');
    this.unadjastedDailyRequirementsForm.get('oMinusMutare').setValue('');
    this.unadjastedDailyRequirementsForm.get('aPlusMutare').setValue('');
    this.unadjastedDailyRequirementsForm.get('aMinusMutare').setValue('');
    this.unadjastedDailyRequirementsForm.get('bPlusMutare').setValue('');
    this.unadjastedDailyRequirementsForm.get('bMinusMutare').setValue('');
    this.unadjastedDailyRequirementsForm.get('abPlusMutare').setValue('');
    this.unadjastedDailyRequirementsForm.get('abMinusMutare').setValue('');
    this.unadjastedDailyRequirementsForm.get('totalMutare').setValue('');
    this.unadjastedDailyRequirementsForm.get('oPlusMasvingo').setValue('');
    this.unadjastedDailyRequirementsForm.get('oMinusMasvingo').setValue('');
    this.unadjastedDailyRequirementsForm.get('aPlusMasvingo').setValue('');
    this.unadjastedDailyRequirementsForm.get('aMinusMasvingo').setValue('');
    this.unadjastedDailyRequirementsForm.get('bPlusMasvingo').setValue('');
    this.unadjastedDailyRequirementsForm.get('bMinusMasvingo').setValue('');
    this.unadjastedDailyRequirementsForm.get('abPlusMasvingo').setValue('');
    this.unadjastedDailyRequirementsForm.get('abMinusMasvingo').setValue('');
    this.unadjastedDailyRequirementsForm.get('totalMasvingo').setValue('');
    this.unadjastedDailyRequirementsForm.get('oPlusTotalDailyRequirements').setValue('');
    this.unadjastedDailyRequirementsForm.get('oMinusTotalDailyRequirements').setValue('');
    this.unadjastedDailyRequirementsForm.get('aPlusTotalDailyRequirements').setValue('');
    this.unadjastedDailyRequirementsForm.get('aMinusTotalDailyRequirements').setValue('');
    this.unadjastedDailyRequirementsForm.get('bPlusTotalDailyRequirements').setValue('');
    this.unadjastedDailyRequirementsForm.get('bMinusTotalDailyRequirements').setValue('');
    this.unadjastedDailyRequirementsForm.get('abPlusTotalDailyRequirements').setValue('');
    this.unadjastedDailyRequirementsForm.get('abMinusTotalDailyRequirements').setValue('');
    this.unadjastedDailyRequirementsForm.get('totalTotalDailyRequirements').setValue('');
  }
  populateUADReq(UnadjustedDailyRequirementsOb: UnadjustedDailyRequirements) {
    if (UnadjustedDailyRequirements !== null && UnadjustedDailyRequirements !== undefined) {
    this.unadjastedDailyRequirementsForm.get('id').setValue(UnadjustedDailyRequirementsOb.id);
    this.unadjastedDailyRequirementsForm.get('dateCreated').setValue(UnadjustedDailyRequirementsOb.dateCreated);
    this.unadjastedDailyRequirementsForm.get('version').setValue(UnadjustedDailyRequirementsOb.version);
    this.unadjastedDailyRequirementsForm.get('createdById').setValue(UnadjustedDailyRequirementsOb.createdById);
    this.unadjastedDailyRequirementsForm.get('oPlusHarare').setValue(UnadjustedDailyRequirementsOb.oPlusHarare);
    this.unadjastedDailyRequirementsForm.get('oMinusHarare').setValue(UnadjustedDailyRequirementsOb.oMinusHarare);
    this.unadjastedDailyRequirementsForm.get('aPlusHarare').setValue(UnadjustedDailyRequirementsOb.aPlusHarare);
    this.unadjastedDailyRequirementsForm.get('aMinusHarare').setValue(UnadjustedDailyRequirementsOb.aMinusHarare);
    this.unadjastedDailyRequirementsForm.get('bPlusHarare').setValue(UnadjustedDailyRequirementsOb.bPlusHarare);
    this.unadjastedDailyRequirementsForm.get('bMinusHarare').setValue(UnadjustedDailyRequirementsOb.bMinusHarare);
    this.unadjastedDailyRequirementsForm.get('abPlusHarare').setValue(UnadjustedDailyRequirementsOb.abPlusHarare);
    this.unadjastedDailyRequirementsForm.get('abMinusHarare').setValue(UnadjustedDailyRequirementsOb.abMinusHarare);
    this.unadjastedDailyRequirementsForm.get('totalHarare').setValue(UnadjustedDailyRequirementsOb.totalHarare);
    this.unadjastedDailyRequirementsForm.get('oPlusBulawayo').setValue(UnadjustedDailyRequirementsOb.oPlusBulawayo);
    this.unadjastedDailyRequirementsForm.get('oMinusBulawayo').setValue(UnadjustedDailyRequirementsOb.oMinusBulawayo);
    this.unadjastedDailyRequirementsForm.get('aPlusBulawayo').setValue(UnadjustedDailyRequirementsOb.aPlusBulawayo);
    this.unadjastedDailyRequirementsForm.get('aMinusBulawayo').setValue(UnadjustedDailyRequirementsOb.aMinusBulawayo);
    this.unadjastedDailyRequirementsForm.get('bPlusBulawayo').setValue(UnadjustedDailyRequirementsOb.bPlusBulawayo);
    this.unadjastedDailyRequirementsForm.get('bMinusBulawayo').setValue(UnadjustedDailyRequirementsOb.bMinusBulawayo);
    this.unadjastedDailyRequirementsForm.get('abPlusBulawayo').setValue(UnadjustedDailyRequirementsOb.abPlusBulawayo);
    this.unadjastedDailyRequirementsForm.get('abMinusBulawayo').setValue(UnadjustedDailyRequirementsOb.abMinusBulawayo);
    this.unadjastedDailyRequirementsForm.get('totalBulawayo').setValue(UnadjustedDailyRequirementsOb.totalBulawayo);
    this.unadjastedDailyRequirementsForm.get('oPlusGweru').setValue(UnadjustedDailyRequirementsOb.oPlusGweru);
    this.unadjastedDailyRequirementsForm.get('oMinusGweru').setValue(UnadjustedDailyRequirementsOb.oMinusGweru);
    this.unadjastedDailyRequirementsForm.get('aPlusGweru').setValue(UnadjustedDailyRequirementsOb.aPlusGweru);
    this.unadjastedDailyRequirementsForm.get('aMinusGweru').setValue(UnadjustedDailyRequirementsOb.aMinusGweru);
    this.unadjastedDailyRequirementsForm.get('bPlusGweru').setValue(UnadjustedDailyRequirementsOb.bPlusGweru);
    this.unadjastedDailyRequirementsForm.get('bMinusGweru').setValue(UnadjustedDailyRequirementsOb.bMinusGweru);
    this.unadjastedDailyRequirementsForm.get('abPlusGweru').setValue(UnadjustedDailyRequirementsOb.abPlusGweru);
    this.unadjastedDailyRequirementsForm.get('abMinusGweru').setValue(UnadjustedDailyRequirementsOb.abMinusGweru);
    this.unadjastedDailyRequirementsForm.get('totalGweru').setValue(UnadjustedDailyRequirementsOb.totalGweru);
    this.unadjastedDailyRequirementsForm.get('oPlusMutare').setValue(UnadjustedDailyRequirementsOb.oPlusMutare);
    this.unadjastedDailyRequirementsForm.get('oMinusMutare').setValue(UnadjustedDailyRequirementsOb.oMinusMutare);
    this.unadjastedDailyRequirementsForm.get('aPlusMutare').setValue(UnadjustedDailyRequirementsOb.aPlusMutare);
    this.unadjastedDailyRequirementsForm.get('aMinusMutare').setValue(UnadjustedDailyRequirementsOb.aMinusMutare);
    this.unadjastedDailyRequirementsForm.get('bPlusMutare').setValue(UnadjustedDailyRequirementsOb.bPlusMutare);
    this.unadjastedDailyRequirementsForm.get('bMinusMutare').setValue(UnadjustedDailyRequirementsOb.bMinusMutare);
    this.unadjastedDailyRequirementsForm.get('abPlusMutare').setValue(UnadjustedDailyRequirementsOb.abPlusMutare);
    this.unadjastedDailyRequirementsForm.get('abMinusMutare').setValue(UnadjustedDailyRequirementsOb.abMinusMutare);
    this.unadjastedDailyRequirementsForm.get('totalMutare').setValue(UnadjustedDailyRequirementsOb.totalMutare);
    this.unadjastedDailyRequirementsForm.get('oPlusMasvingo').setValue(UnadjustedDailyRequirementsOb.oPlusMasvingo);
    this.unadjastedDailyRequirementsForm.get('oMinusMasvingo').setValue(UnadjustedDailyRequirementsOb.oMinusMasvingo);
    this.unadjastedDailyRequirementsForm.get('aPlusMasvingo').setValue(UnadjustedDailyRequirementsOb.aPlusMasvingo);
    this.unadjastedDailyRequirementsForm.get('aMinusMasvingo').setValue(UnadjustedDailyRequirementsOb.aMinusMasvingo);
    this.unadjastedDailyRequirementsForm.get('bPlusMasvingo').setValue(UnadjustedDailyRequirementsOb.bPlusMasvingo);
    this.unadjastedDailyRequirementsForm.get('bMinusMasvingo').setValue(UnadjustedDailyRequirementsOb.bMinusMasvingo);
    this.unadjastedDailyRequirementsForm.get('abPlusMasvingo').setValue(UnadjustedDailyRequirementsOb.abPlusMasvingo);
    this.unadjastedDailyRequirementsForm.get('abMinusMasvingo').setValue(UnadjustedDailyRequirementsOb.abMinusMasvingo);
    this.unadjastedDailyRequirementsForm.get('totalMasvingo').setValue(UnadjustedDailyRequirementsOb.totalMasvingo);
    this.unadjastedDailyRequirementsForm.get('oPlusTotalDailyRequirements').setValue(UnadjustedDailyRequirementsOb.oPlusTotalDailyRequirements);
    this.unadjastedDailyRequirementsForm.get('oMinusTotalDailyRequirements').setValue(UnadjustedDailyRequirementsOb.oMinusTotalDailyRequirements);
    this.unadjastedDailyRequirementsForm.get('aPlusTotalDailyRequirements').setValue(UnadjustedDailyRequirementsOb.aPlusTotalDailyRequirements);
    this.unadjastedDailyRequirementsForm.get('aMinusTotalDailyRequirements').setValue(UnadjustedDailyRequirementsOb.aMinusTotalDailyRequirements);
    this.unadjastedDailyRequirementsForm.get('bPlusTotalDailyRequirements').setValue(UnadjustedDailyRequirementsOb.bPlusTotalDailyRequirements);
    this.unadjastedDailyRequirementsForm.get('bMinusTotalDailyRequirements').setValue(UnadjustedDailyRequirementsOb.bMinusTotalDailyRequirements);
    this.unadjastedDailyRequirementsForm.get('abPlusTotalDailyRequirements').setValue(UnadjustedDailyRequirementsOb.abPlusTotalDailyRequirements);
    this.unadjastedDailyRequirementsForm.get('abMinusTotalDailyRequirements').setValue(UnadjustedDailyRequirementsOb.abMinusTotalDailyRequirements);
    this.unadjastedDailyRequirementsForm.get('totalTotalDailyRequirements').setValue(UnadjustedDailyRequirementsOb.totalTotalDailyRequirements);
  }
}

  sumOplus(value) {
    let total = 0;
    total = Number(value.oPlusHarare) + Number(value.oPlusBulawayo)
     + Number(value.oPlusGweru) + Number(value.oPlusMutare) + Number(value.oPlusMasvingo);
    this.unadjastedDailyRequirementsForm.get('oPlusTotalDailyRequirements').setValue(total);
  }

  sumOminus(value) {
    let total = 0;
    total = Number(value.oMinusHarare) + Number(value.oMinusBulawayo)
     + Number(value.oMinusGweru) + Number(value.oMinusMutare) + Number(value.oMinusMasvingo);
    this.unadjastedDailyRequirementsForm.get('oMinusTotalDailyRequirements').setValue(total);
  }
  sumAplus(value) {
    let total = 0;
    total = Number(value.aPlusHarare) + Number(value.aPlusBulawayo)
     + Number(value.aPlusGweru) + Number(value.aPlusMutare) + Number(value.aPlusMasvingo);
    this.unadjastedDailyRequirementsForm.get('aPlusTotalDailyRequirements').setValue(total);
  }
  sumAminus(value) {
    let total = 0;
    total = Number(value.aMinusHarare) + Number(value.aMinusBulawayo)
     + Number(value.aMinusGweru) + Number(value.aMinusMutare) + Number(value.aMinusMasvingo);
    this.unadjastedDailyRequirementsForm.get('aMinusTotalDailyRequirements').setValue(total);
  }
  sumBplus(value) {
    let total = 0;
    total = Number(value.bPlusHarare) + Number(value.bPlusBulawayo)
     + Number(value.bPlusGweru) + Number(value.bPlusMutare) + Number(value.bPlusMasvingo);
    this.unadjastedDailyRequirementsForm.get('bPlusTotalDailyRequirements').setValue(total);
  }
  sumBminus(value) {
    let total = 0;
    total = Number(value.bMinusHarare) + Number(value.bMinusBulawayo)
     + Number(value.bMinusGweru) + Number(value.bMinusMutare) + Number(value.bMinusMasvingo);
    this.unadjastedDailyRequirementsForm.get('bMinusTotalDailyRequirements').setValue(total);
  }
  sumABplus(value) {
    let total = 0;
    total = Number(value.abPlusHarare) + Number(value.abPlusBulawayo)
     + Number(value.abPlusGweru) + Number(value.abPlusMutare) + Number(value.abPlusMasvingo);
    this.unadjastedDailyRequirementsForm.get('abPlusTotalDailyRequirements').setValue(total);
  }
  sumABminus(value) {
    let total = 0;
    total = Number(value.abMinusHarare) + Number(value.abMinusBulawayo)
     + Number(value.abMinusGweru) + Number(value.abMinusMutare) + Number(value.abMinusMasvingo);
    this.unadjastedDailyRequirementsForm.get('abMinusTotalDailyRequirements').setValue(total);
  }

  branchSum(value, present?) {
    let total = 0;
    total = Number(value.totalHarare) + Number(value.totalBulawayo) + Number(value.totalMasvingo) + Number(value.totalGweru)
    + Number(value.totalMutare) + present;
    this.unadjastedDailyRequirementsForm.get('totalTotalDailyRequirements').setValue(total);
  }

  sumHarare(value) {
    let total = 0;
    total = Number(value.oPlusHarare) + Number(value.oMinusHarare) + Number(value.aPlusHarare) + Number(value.aMinusHarare)
    + Number(value.bPlusHarare) + Number(value.bMinusHarare) + Number(value.abPlusHarare) + Number(value.abMinusHarare) ;
    this.unadjastedDailyRequirementsForm.get('totalHarare').setValue(total);
    this.branchSum(value, total - value.totalHarare);
  }
  sumBulawayo(value) {
    let total = 0;
    total = Number(value.oPlusBulawayo) + Number(value.oMinusBulawayo) + Number(value.aPlusBulawayo) + Number(value.aMinusBulawayo)
    + Number(value.bPlusBulawayo) + Number(value.bMinusBulawayo) + Number(value.abPlusBulawayo) + Number(value.abMinusBulawayo) ;
    this.unadjastedDailyRequirementsForm.get('totalBulawayo').setValue(total);
    this.branchSum(value, total - value.totalBulawayo);
  }
  sumGweru(value) {
    let total = 0;
    total = Number(value.oPlusGweru) + Number(value.oMinusGweru) + Number(value.aPlusGweru) + Number(value.aMinusGweru)
    + Number(value.bPlusGweru) + Number(value.bMinusGweru) + Number(value.abPlusGweru) + Number(value.abMinusGweru) ;
    this.unadjastedDailyRequirementsForm.get('totalGweru').setValue(total);
    this.branchSum(value, total - value.totalGweru);
  }
  sumMutare(value) {
    let total = 0;
    total = Number(value.oPlusMutare) + Number(value.oMinusMutare) + Number(value.aPlusMutare) + Number(value.aMinusMutare)
    + Number(value.bPlusMutare) + Number(value.bMinusMutare) + Number(value.abPlusMutare) + Number(value.abMinusMutare) ;
    this.unadjastedDailyRequirementsForm.get('totalMutare').setValue(total);
    this.branchSum(value, total - value.totalMutare);
  }
  sumMasvingo(value) {
    let total = 0;
    total = Number(value.oPlusMasvingo) + Number(value.oMinusMasvingo) + Number(value.aPlusMasvingo) + Number(value.aMinusMasvingo)
    + Number(value.bPlusMasvingo) + Number(value.bMinusMasvingo) + Number(value.abPlusMasvingo) + Number(value.abMinusMasvingo) ;
    this.unadjastedDailyRequirementsForm.get('totalMasvingo').setValue(total);
    this.branchSum(value, total - value.totalMasvingo);
  }

  getBranchDailyMinimalCapacity() {
    this.dataService.getBranchDailyMinimalCapacity().subscribe(
      result => {
        this.branchDailyMinimalCapacityOb = result;
        if (this.branchDailyMinimalCapacityOb !== null && this.branchDailyMinimalCapacityOb !== undefined) {
          this.populateBDMCap(this.branchDailyMinimalCapacityOb);
          this.sumTotalMinCapacity(this.branchDailyMinimalCapacityOb);
        }
      },
        error => {
        console.log(error.error);
      },
      () => {
      }
    );
  }

  saveBranchDailyMinimalCapacity(value) {
    this.dataService.saveBranchDailyMinimalCapacity(value).subscribe(
      result => {
        console.log(result);
        this.branchDailyMinimalCapacity = result;
        this.snotify.success(result.message, 'Success', this.util.getNotifyConfig());
      },
        error => {
        // console.log(error.error);
        this.snotify.error(error.error, 'Error', this.util.getNotifyConfig());
      },
      () => {
        this.getBranchDailyMinimalCapacity();
      }
    );
  }
  clearBDMC() {
    this.branchDailyMinimalCapacityForm.get('harareStaticCbd').setValue('');
    this.branchDailyMinimalCapacityForm.get('harareMob1').setValue('');
    this.branchDailyMinimalCapacityForm.get('harareMob2').setValue('');
    this.branchDailyMinimalCapacityForm.get('harareMob3').setValue('');
    this.branchDailyMinimalCapacityForm.get('harareTotalMinCapacity').setValue('');
    // this.branchDailyMinimalCapacityForm.get('harareExpectedDailyCollections').setValue('');
    this.branchDailyMinimalCapacityForm.get('hararePercentageCapacity').setValue('');
    // this.branchDailyMinimalCapacityForm.get('pcHarare').setValue('');
    this.branchDailyMinimalCapacityForm.get('bulawayoStaticCbd').setValue('');
    this.branchDailyMinimalCapacityForm.get('bulawayoMob1').setValue('');
    this.branchDailyMinimalCapacityForm.get('bulawayoMob2').setValue('');
    this.branchDailyMinimalCapacityForm.get('bulawayoMob3').setValue('');
    this.branchDailyMinimalCapacityForm.get('bulawayoTotalMinCapacity').setValue('');
    // this.branchDailyMinimalCapacityForm.get('bulawayoExpectedDailyCollections').setValue('');
    this.branchDailyMinimalCapacityForm.get('bulawayoPercentageCapacity').setValue('');
    this.branchDailyMinimalCapacityForm.get('gweruStaticCbd').setValue('');
    this.branchDailyMinimalCapacityForm.get('gweruMob1').setValue('');
    this.branchDailyMinimalCapacityForm.get('gweruMob2').setValue('');
    this.branchDailyMinimalCapacityForm.get('gweruMob3').setValue('');
    this.branchDailyMinimalCapacityForm.get('gweruTotalMinCapacity').setValue('');
    // this.branchDailyMinimalCapacityForm.get('gweruExpectedDailyCollections').setValue('');
    this.branchDailyMinimalCapacityForm.get('gweruPercentageCapacity').setValue('');
    this.branchDailyMinimalCapacityForm.get('mutareStaticCbd').setValue('');
    this.branchDailyMinimalCapacityForm.get('mutareMob1').setValue('');
    this.branchDailyMinimalCapacityForm.get('mutareMob2').setValue('');
    this.branchDailyMinimalCapacityForm.get('mutareMob3').setValue('');
    this.branchDailyMinimalCapacityForm.get('mutareTotalMinCapacity').setValue('');
    // this.branchDailyMinimalCapacityForm.get('mutareExpectedDailyCollections').setValue('');
    this.branchDailyMinimalCapacityForm.get('mutarePercentageCapacity').setValue('');
    this.branchDailyMinimalCapacityForm.get('masvingoStaticCbd').setValue('');
    this.branchDailyMinimalCapacityForm.get('masvingoMob1').setValue('');
    this.branchDailyMinimalCapacityForm.get('masvingoMob2').setValue('');
    this.branchDailyMinimalCapacityForm.get('masvingoMob3').setValue('');
    this.branchDailyMinimalCapacityForm.get('masvingoTotalMinCapacity').setValue('');
    // this.branchDailyMinimalCapacityForm.get('masvingoExpectedDailyCollections').setValue('');
    this.branchDailyMinimalCapacityForm.get('masvingoPercentageCapacity').setValue('');
    this.branchDailyMinimalCapacityForm.get('totalStaticCbd').setValue('');
    this.branchDailyMinimalCapacityForm.get('totalMob1').setValue('');
    this.branchDailyMinimalCapacityForm.get('totalMob2').setValue('');
    this.branchDailyMinimalCapacityForm.get('totalMob3').setValue('');
    this.branchDailyMinimalCapacityForm.get('totalTotalMinCapacity').setValue('');
    // this.branchDailyMinimalCapacityForm.get('totalExDailyCollections').setValue('');
    this.branchDailyMinimalCapacityForm.get('totalPercentageCapacity').setValue('');
    this.branchDailyMinimalCapacityForm.get('fixedPercentage').setValue('');
    this.branchDailyMinimalCapacityForm.get('mobPercentage').setValue('');
  }
  populateBDMCap(branchDailyMinimalCapacityOb: BranchDailyMinimalCapacity) {
    this.branchDailyMinimalCapacityForm.get('id').setValue(branchDailyMinimalCapacityOb.id);
    this.branchDailyMinimalCapacityForm.get('dateCreated').setValue(branchDailyMinimalCapacityOb.dateCreated);
    this.branchDailyMinimalCapacityForm.get('version').setValue(branchDailyMinimalCapacityOb.version);
    this.branchDailyMinimalCapacityForm.get('createdById').setValue(branchDailyMinimalCapacityOb.createdById);
    this.branchDailyMinimalCapacityForm.get('harareStaticCbd').setValue(branchDailyMinimalCapacityOb.harareStaticCbd);
    this.branchDailyMinimalCapacityForm.get('harareMob1').setValue(branchDailyMinimalCapacityOb.harareMob1);
    this.branchDailyMinimalCapacityForm.get('harareMob2').setValue(branchDailyMinimalCapacityOb.harareMob2);
    this.branchDailyMinimalCapacityForm.get('harareMob3').setValue(branchDailyMinimalCapacityOb.harareMob3);
    this.branchDailyMinimalCapacityForm.get('harareTotalMinCapacity').setValue(branchDailyMinimalCapacityOb.harareTotalMinCapacity);
    this.branchDailyMinimalCapacityForm.get('bulawayoStaticCbd').setValue(branchDailyMinimalCapacityOb.bulawayoStaticCbd);
    this.branchDailyMinimalCapacityForm.get('bulawayoMob1').setValue(branchDailyMinimalCapacityOb.bulawayoMob1);
    this.branchDailyMinimalCapacityForm.get('bulawayoMob2').setValue(branchDailyMinimalCapacityOb.bulawayoMob2);
    this.branchDailyMinimalCapacityForm.get('bulawayoMob3').setValue(branchDailyMinimalCapacityOb.bulawayoMob3);
    this.branchDailyMinimalCapacityForm.get('bulawayoTotalMinCapacity').setValue(branchDailyMinimalCapacityOb.bulawayoTotalMinCapacity);
    this.branchDailyMinimalCapacityForm.get('gweruStaticCbd').setValue(branchDailyMinimalCapacityOb.gweruStaticCbd);
    this.branchDailyMinimalCapacityForm.get('gweruMob1').setValue(branchDailyMinimalCapacityOb.gweruMob1);
    this.branchDailyMinimalCapacityForm.get('gweruMob2').setValue(branchDailyMinimalCapacityOb.gweruMob2);
    this.branchDailyMinimalCapacityForm.get('gweruMob3').setValue(branchDailyMinimalCapacityOb.gweruMob3);
    this.branchDailyMinimalCapacityForm.get('gweruTotalMinCapacity').setValue(branchDailyMinimalCapacityOb.gweruTotalMinCapacity);
    this.branchDailyMinimalCapacityForm.get('mutareStaticCbd').setValue(branchDailyMinimalCapacityOb.mutareStaticCbd);
    this.branchDailyMinimalCapacityForm.get('mutareMob1').setValue(branchDailyMinimalCapacityOb.mutareMob1);
    this.branchDailyMinimalCapacityForm.get('mutareMob2').setValue(branchDailyMinimalCapacityOb.mutareMob2);
    this.branchDailyMinimalCapacityForm.get('mutareMob3').setValue(branchDailyMinimalCapacityOb.mutareMob3);
    this.branchDailyMinimalCapacityForm.get('mutareTotalMinCapacity').setValue(branchDailyMinimalCapacityOb.mutareTotalMinCapacity);
    this.branchDailyMinimalCapacityForm.get('masvingoStaticCbd').setValue(branchDailyMinimalCapacityOb.masvingoStaticCbd);
    this.branchDailyMinimalCapacityForm.get('masvingoMob1').setValue(branchDailyMinimalCapacityOb.masvingoMob1);
    this.branchDailyMinimalCapacityForm.get('masvingoMob2').setValue(branchDailyMinimalCapacityOb.masvingoMob2);
    this.branchDailyMinimalCapacityForm.get('masvingoMob3').setValue(branchDailyMinimalCapacityOb.masvingoMob3);
    this.branchDailyMinimalCapacityForm.get('masvingoTotalMinCapacity').setValue(branchDailyMinimalCapacityOb.masvingoTotalMinCapacity);
    this.branchDailyMinimalCapacityForm.get('totalStaticCbd').setValue(branchDailyMinimalCapacityOb.totalStaticCbd);
    this.branchDailyMinimalCapacityForm.get('totalMob1').setValue(branchDailyMinimalCapacityOb.totalMob1);
    this.branchDailyMinimalCapacityForm.get('totalMob2').setValue(branchDailyMinimalCapacityOb.totalMob2);
    this.branchDailyMinimalCapacityForm.get('totalMob3').setValue(branchDailyMinimalCapacityOb.totalMob3);
    this.branchDailyMinimalCapacityForm.get('totalTotalMinCapacity').setValue(branchDailyMinimalCapacityOb.totalTotalMinCapacity);
    this.branchDailyMinimalCapacityForm.get('totalPercentageCapacity').setValue(100);
  }

  sumTotalMinCapacity(value,  present?: number) {
    let total = 0;
    if (present === undefined || null) {present = 0; }
    total += Number(value.harareTotalMinCapacity) + Number(value.bulawayoTotalMinCapacity) + Number(value.gweruTotalMinCapacity) +
            Number(value.mutareTotalMinCapacity) + Number(value.masvingoTotalMinCapacity) + present;
    this.branchDailyMinimalCapacityForm.get('totalTotalMinCapacity').setValue(total);
    this.branchDailyMinimalCapacityForm.get('fixedPercentage').setValue(
      Math.round((Number(value.totalStaticCbd)  / total) * 100));
    this.branchDailyMinimalCapacityForm.get('mobPercentage').setValue(
       100 - Math.round((Number(value.totalStaticCbd)  / total) * 100));

    this.branchDailyMinimalCapacityForm.get('hararePercentageCapacity').setValue(
      Math.round((Number(value.harareTotalMinCapacity)
      / this.branchDailyMinimalCapacityForm.get('harareExpectedDailyCollections').value * 100)));
    this.branchDailyMinimalCapacityForm.get('bulawayoPercentageCapacity').setValue(
    Math.round((Number(value.bulawayoTotalMinCapacity)
    / this.branchDailyMinimalCapacityForm.get('bulawayoExpectedDailyCollections').value * 100)));
    this.branchDailyMinimalCapacityForm.get('gweruPercentageCapacity').setValue(
      Math.round((Number(value.gweruTotalMinCapacity)
      / this.branchDailyMinimalCapacityForm.get('gweruExpectedDailyCollections').value * 100)));
    this.branchDailyMinimalCapacityForm.get('mutarePercentageCapacity').setValue(
      Math.round((Number(value.mutareTotalMinCapacity)
      / this.branchDailyMinimalCapacityForm.get('mutareExpectedDailyCollections').value * 100)));
    this.branchDailyMinimalCapacityForm.get('masvingoPercentageCapacity').setValue(
    Math.round((Number(value.masvingoTotalMinCapacity)
    / this.branchDailyMinimalCapacityForm.get('masvingoExpectedDailyCollections').value * 100)));
          }

  totalMinCap(value) {
    this.branchDailyMinimalCapacityForm.get('harareExpectedDailyCollections').setValue(value.harareTotal);
    this.branchDailyMinimalCapacityForm.get('bulawayoExpectedDailyCollections').setValue(value.bulawayoTotal);
    this.branchDailyMinimalCapacityForm.get('gweruExpectedDailyCollections').setValue(value.gweruTotal);
    this.branchDailyMinimalCapacityForm.get('mutareExpectedDailyCollections').setValue(value.mutareTotal);
    this.branchDailyMinimalCapacityForm.get('masvingoExpectedDailyCollections').setValue(value.masvingoTotal);
    this.branchDailyMinimalCapacityForm.get('totalExDailyCollections').setValue(value.nationalRequirementsTotal);


  }

  calculatePercentageCapacity(value) {
      let total = 0;
      total = value.harareTotal + value.bulawayoTotal + value.gweruTotal + value.mutareTotal + value.masvingoTotal;
      this.branchDailyMinimalCapacityForm.get('hararePercentageCapacity').setValue(Math.round((value.harareTotal  / total) * 100));
      this.branchDailyMinimalCapacityForm.get('bulawayoPercentageCapacity').setValue(Math.round((value.bulawayoTotal  / total) * 100));
      this.branchDailyMinimalCapacityForm.get('gweruPercentageCapacity').setValue(Math.round((value.gweruTotal  / total) * 100));
      this.branchDailyMinimalCapacityForm.get('mutarePercentageCapacity').setValue(Math.round((value.mutareTotal  / total) * 100));
      this.branchDailyMinimalCapacityForm.get('masvingoPercentageCapacity').setValue(Math.round((value.masvingoTotal  / total) * 100));
  }
  sumBMDCharare(value): number {
    let total = 0;
    total = Number(value.harareStaticCbd) + Number(value.harareMob1) + Number(value.harareMob2) + Number(value.harareMob3);
    this.branchDailyMinimalCapacityForm.get('harareTotalMinCapacity').setValue(total);
    this.sumTotalMinCapacity(value, total - Number(value.harareTotalMinCapacity));
    return total;
  }

  sumBMDCbulawayo(value) {
    let total = 0;
    total = Number(value.bulawayoStaticCbd) + Number(value.bulawayoMob1) + Number(value.bulawayoMob2) + Number(value.bulawayoMob3);
    this.branchDailyMinimalCapacityForm.get('bulawayoTotalMinCapacity').setValue(total);
    this.sumTotalMinCapacity(value, total - Number(value.bulawayoTotalMinCapacity));
  }

  sumBMDCgweru(value) {
    let total = 0;
    total = Number(value.gweruStaticCbd) + Number(value.gweruMob1) + Number(value.gweruMob2) + Number(value.gweruMob3);
    this.branchDailyMinimalCapacityForm.get('gweruTotalMinCapacity').setValue(total);
    this.sumTotalMinCapacity(value, total - Number(value.gweruTotalMinCapacity));
  }

  sumBMDCmutare(value) {
    let total = 0;
    total = Number(value.mutareStaticCbd) + Number(value.mutareMob1) + Number(value.mutareMob2) + Number(value.mutareMob3);
    this.branchDailyMinimalCapacityForm.get('mutareTotalMinCapacity').setValue(total);
    this.sumTotalMinCapacity(value, total - Number(value.mutareTotalMinCapacity));
  }
  sumBMDCmasvingo(value) {
    let total = 0;
    total = Number(value.masvingoStaticCbd) + Number(value.masvingoMob1) + Number(value.masvingoMob2) + Number(value.masvingoMob3);
    this.branchDailyMinimalCapacityForm.get('masvingoTotalMinCapacity').setValue(total);
    this.sumTotalMinCapacity(value, total - Number(value.masvingoTotalMinCapacity));
  }

  sumStaticTotal(value): number {
    let total = 0;
    total = Number(value.harareStaticCbd) + Number(value.bulawayoStaticCbd) + Number(value.gweruStaticCbd)
     + Number(value.mutareStaticCbd) + Number(value.masvingoStaticCbd);
    this.branchDailyMinimalCapacityForm.get('totalStaticCbd').setValue(total);
    this.sumTotalMinCapacity(value, total - Number(value.harareTotal));
    this.totalStaticCbdValue = total;
    return total;
  }
  sumMob1Total(value) {
    let total = 0;
    total = Number(value.harareMob1) + Number(value.bulawayoMob1) + Number(value.gweruMob1)
     + Number(value.mutareMob1) + Number(value.masvingoMob1);
    this.branchDailyMinimalCapacityForm.get('totalMob1').setValue(total);
    this.sumTotalMinCapacity(value, total - Number(value.harareTotal));
  }
  sumMob2Total(value) {
    let total = 0;
    total = Number(value.harareMob2) + Number(value.bulawayoMob2) + Number(value.gweruMob2)
     + Number(value.mutareMob2) + Number(value.masvingoMob2);
    this.branchDailyMinimalCapacityForm.get('totalMob2').setValue(total);
    this.sumTotalMinCapacity(value, total - Number(value.harareTotal));
  }
  sumMob3Total(value) {
    let total = 0;
    total = Number(value.harareMob3) + Number(value.bulawayoMob3) + Number(value.gweruMob3)
     + Number(value.mutareMob3) + Number(value.masvingoMob3);
    this.branchDailyMinimalCapacityForm.get('totalMob3').setValue(total);
    this.sumTotalMinCapacity(value, total - Number(value.harareTotal));
  }




}
