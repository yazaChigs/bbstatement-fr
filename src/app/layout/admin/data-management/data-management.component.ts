import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DataManagementService } from '../../../shared/config/service/admin/dataManagement.service';
import { NoDaysRequiremets } from '../../../shared/config/model/admin/no-days-requirements.model';
import { UnadjustedDailyRequirements } from '../../../shared/config/model/admin/unasjusted-daily-requirements.model';
import { BranchDailyMinimalCapacity } from '../../../shared/config/model/admin/branch-daily-minimal-capacity.model';
import { error } from '@angular/compiler/src/util';

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

  constructor(private fb: FormBuilder, private  dataService: DataManagementService) { }

  ngOnInit() {
    this.noDaysRequirements();
    this.unadjastedDailyRequirements();
    this.branchDailyMinimalCapacity();
    this.getNoDaysRequirements();
    this.getBranchDailyMinimalCapacity();
    this.getnadjastedDailyRequirements();

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
    total = value.harareOplus + value.bulawayoOplus + value.gweruOplus +
            value.mutareOplus + value.masvingoOplus;
    this.noDaysRequirementsForm.get('nationalRequirementsOplus').setValue(total);
  }
  sumDaysReqOminus(value) {
    let total = 0;
    total = value.harareOminus + value.bulawayoOminus + value.gweruOminus +
            value.mutareOminus + value.masvingoOminus;
    this.noDaysRequirementsForm.get('nationalRequirementsOminus').setValue(total);
  }
  sumDaysReqAplus(value) {
    let total = 0;
    total = value.harareAplus + value.bulawayoAplus + value.gweruAplus +
            value.mutareAplus + value.masvingoAplus;
    this.noDaysRequirementsForm.get('nationalRequirementsAplus').setValue(total);
  }
  sumDaysReqBplus(value) {
    let total = 0;
    total = value.harareBplus + value.bulawayoBplus + value.gweruBplus +
            value.mutareBplus + value.masvingoBplus;
    this.noDaysRequirementsForm.get('nationalRequirementsBplus').setValue(total);
  }



  sumDaysReqTotal(value, present?, totalToUse?): number {
    let total = 0;
    total = value.harareTotal + value.bulawayoTotal + value.gweruTotal +
            value.mutareTotal + value.masvingoTotal + present;
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
    total = value.harareOplus + value.harareOminus + value.harareAplus + value.harareBplus;
    this.noDaysRequirementsForm.get('harareTotal').setValue(total);
    const natTotal = this.sumDaysReqTotal(value, total - value.harareTotal, total);
    this.noDaysRequirementsForm.get('harareNationalPercentage').setValue( Math.round((total  / natTotal) * 100));
    this.branchDailyMinimalCapacityForm.get('harareTotalMinCapacity').setValue(total);

    // this.sumDaysReqBulawayo(value);
  }
  sumDaysReqBulawayo(value) {
    let total = 0;
    total = value.bulawayoOplus + value.bulawayoOminus + value.bulawayoAplus + value.bulawayoBplus;
    this.noDaysRequirementsForm.get('bulawayoTotal').setValue(total);
    const natTotal = this.sumDaysReqTotal(value, total - value.bulawayoTotal);
    this.noDaysRequirementsForm.get('bulawayoNationalPercentage').setValue( Math.round((total  / natTotal) * 100));

    // this.sumDaysReqHarare(value);
  }
  sumDaysReqGweru(value) {
    let total = 0;
    total = value.gweruOplus + value.gweruOminus + value.gweruAplus + value.gweruBplus;
    this.noDaysRequirementsForm.get('gweruTotal').setValue(total);
    const natTotal = this.sumDaysReqTotal(value, total - value.gweruTotal);
    this.noDaysRequirementsForm.get('gweruNationalPercentage').setValue( Math.round((total  / natTotal) * 100));
  }
  sumDaysReqMutare(value) {
    let total = 0;
    total = value.mutareOplus + value.mutareOminus + value.mutareAplus + value.mutareBplus;
    this.noDaysRequirementsForm.get('mutareTotal').setValue(total);
    const natTotal = this.sumDaysReqTotal(value, total - value.mutareTotal);
    this.noDaysRequirementsForm.get('mutareNationalPercentage').setValue( Math.round((total  / natTotal) * 100));
  }
  sumDaysReqMasvingo(value) {
    let total = 0;
    total = value.masvingoOplus + value.masvingoOminus + value.masvingoAplus + value.masvingoBplus;
    this.noDaysRequirementsForm.get('masvingoTotal').setValue(total);
    const natTotal = this.sumDaysReqTotal(value, total - value.masvingoTotal);
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
      },
      error => {
        console.log(error.error);
      },
      () => {
        this.populateNDReq(this.NoDaysRequiremetsOb);
        this.totalMinCap(this.NoDaysRequiremetsOb);
      }
    );
  }

  saveNoDaysRequirements(value) {
    this.dataService.saveNoDaysRequiremets(value).subscribe(
      result => {
        console.log(result);
      },
      error => {
        console.log(error.error);
      },
      () => {
        this.getNoDaysRequirements();
      }
    );
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
      },
      error => {
        console.log(error.error);
      },
      () => {
        this.populateUADReq(this.UnadjustedDailyRequirementsOb);
      }
    );
  }

  saveUnadjastedDailyRequirements(value) {
    this.dataService.saveUnadjustedDailyRequirements(value).subscribe(
      result => {
        console.log(result);
      },
      error => {
        console.log(error.error);
      },
      () => {
        this.getnadjastedDailyRequirements();
      }
    );
  }
  populateUADReq(UnadjustedDailyRequirementsOb: UnadjustedDailyRequirements) {
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

  sumOplus(value) {
    let total = 0;
    total = value.oPlusHarare + value.oPlusBulawayo + value.oPlusGweru + value.oPlusMutare + value.oPlusMasvingo;
    this.unadjastedDailyRequirementsForm.get('oPlusTotalDailyRequirements').setValue(total);
  }

  sumOminus(value) {
    let total = 0;
    total = value.oMinusHarare + value.oMinusBulawayo + value.oMinusGweru + value.oMinusMutare + value.oMinusMasvingo;
    this.unadjastedDailyRequirementsForm.get('oMinusTotalDailyRequirements').setValue(total);
  }
  sumAplus(value) {
    let total = 0;
    total = value.aPlusHarare + value.aPlusBulawayo + value.aPlusGweru + value.aPlusMutare + value.aPlusMasvingo;
    this.unadjastedDailyRequirementsForm.get('aPlusTotalDailyRequirements').setValue(total);
  }
  sumAminus(value) {
    let total = 0;
    total = value.aMinusHarare + value.aMinusBulawayo + value.aMinusGweru + value.aMinusMutare + value.aMinusMasvingo;
    this.unadjastedDailyRequirementsForm.get('aMinusTotalDailyRequirements').setValue(total);
  }
  sumBplus(value) {
    let total = 0;
    total = value.bPlusHarare + value.bPlusBulawayo + value.bPlusGweru + value.bPlusMutare + value.bPlusMasvingo;
    this.unadjastedDailyRequirementsForm.get('bPlusTotalDailyRequirements').setValue(total);
  }
  sumBminus(value) {
    let total = 0;
    total = value.bMinusHarare + value.bMinusBulawayo + value.bMinusGweru + value.bMinusMutare + value.bMinusMasvingo;
    this.unadjastedDailyRequirementsForm.get('bMinusTotalDailyRequirements').setValue(total);
  }
  sumABplus(value) {
    let total = 0;
    total = value.abPlusHarare + value.abPlusBulawayo + value.abPlusGweru + value.abPlusMutare + value.abPlusMasvingo;
    this.unadjastedDailyRequirementsForm.get('abPlusTotalDailyRequirements').setValue(total);
  }
  sumABminus(value) {
    let total = 0;
    total = value.abMinusHarare + value.abMinusBulawayo + value.abMinusGweru + value.abMinusMutare + value.abMinusMasvingo;
    this.unadjastedDailyRequirementsForm.get('abMinusTotalDailyRequirements').setValue(total);
  }

  branchSum(value, present?) {
    let total = 0;
    total = value.totalHarare + value.totalBulawayo + value.totalMasvingo + value.totalGweru
    + value.totalMutare + present;
    this.unadjastedDailyRequirementsForm.get('totalTotalDailyRequirements').setValue(total);
  }

  sumHarare(value) {
    let total = 0;
    total = value.oPlusHarare + value.oMinusHarare + value.aPlusHarare + value.aMinusHarare
    + value.bPlusHarare + value.bMinusHarare + value.abPlusHarare + value.abMinusHarare ;
    this.unadjastedDailyRequirementsForm.get('totalHarare').setValue(total);
    this.branchSum(value, total - value.totalHarare);
  }
  sumBulawayo(value) {
    let total = 0;
    total = value.oPlusBulawayo + value.oMinusBulawayo + value.aPlusBulawayo + value.aMinusBulawayo
    + value.bPlusBulawayo + value.bMinusBulawayo + value.abPlusBulawayo + value.abMinusBulawayo ;
    this.unadjastedDailyRequirementsForm.get('totalBulawayo').setValue(total);
  }
  sumGweru(value) {
    let total = 0;
    total = value.oPlusGweru + value.oMinusGweru + value.aPlusGweru + value.aMinusGweru
    + value.bPlusGweru + value.bMinusGweru + value.abPlusGweru + value.abMinusGweru ;
    this.unadjastedDailyRequirementsForm.get('totalGweru').setValue(total);
  }
  sumMutare(value) {
    let total = 0;
    total = value.oPlusMutare + value.oMinusMutare + value.aPlusMutare + value.aMinusMutare
    + value.bPlusMutare + value.bMinusMutare + value.abPlusMutare + value.abMinusMutare ;
    this.unadjastedDailyRequirementsForm.get('totalMutare').setValue(total);
  }
  sumMasvingo(value) {
    let total = 0;
    total = value.oPlusMasvingo + value.oMinusMasvingo + value.aPlusMasvingo + value.aMinusMasvingo
    + value.bPlusMasvingo + value.bMinusMasvingo + value.abPlusMasvingo + value.abMinusMasvingo ;
    this.unadjastedDailyRequirementsForm.get('totalMasvingo').setValue(total);
  }

  getBranchDailyMinimalCapacity() {
    this.dataService.getBranchDailyMinimalCapacity().subscribe(
      result => {
        this.branchDailyMinimalCapacityOb = result;
      },
        error => {
        console.log(error.error);
      },
      () => {
        this.populateBDMCap(this.branchDailyMinimalCapacityOb);
        this.sumTotalMinCapacity(this.branchDailyMinimalCapacityOb);
      }
    );
  }

  saveBranchDailyMinimalCapacity(value) {
    this.dataService.saveBranchDailyMinimalCapacity(value).subscribe(
      result => {
        console.log(result);
        this.branchDailyMinimalCapacity = result;
      },
        error => {
        console.log(error.error);
      },
      () => {
        this.getBranchDailyMinimalCapacity();
      }
    );
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
    // this.branchDailyMinimalCapacityForm.get('harareExpectedDailyCollections').setValue(branchDailyMinimalCapacityOb.harareExpectedDailyCollections);
    // this.branchDailyMinimalCapacityForm.get('pcHarare').setValue(branchDailyMinimalCapacityOb.hararePercentageCapacity);
    this.branchDailyMinimalCapacityForm.get('bulawayoStaticCbd').setValue(branchDailyMinimalCapacityOb.bulawayoStaticCbd);
    this.branchDailyMinimalCapacityForm.get('bulawayoMob1').setValue(branchDailyMinimalCapacityOb.bulawayoMob1);
    this.branchDailyMinimalCapacityForm.get('bulawayoMob2').setValue(branchDailyMinimalCapacityOb.bulawayoMob2);
    this.branchDailyMinimalCapacityForm.get('bulawayoMob3').setValue(branchDailyMinimalCapacityOb.bulawayoMob3);
    this.branchDailyMinimalCapacityForm.get('bulawayoTotalMinCapacity').setValue(branchDailyMinimalCapacityOb.bulawayoTotalMinCapacity);
    // this.branchDailyMinimalCapacityForm.get('bulawayoExpectedDailyCollections').setValue(branchDailyMinimalCapacityOb.bulawayoExpectedDailyCollections);
    // this.branchDailyMinimalCapacityForm.get('bulawayoPercentageCapacity').setValue(branchDailyMinimalCapacityOb.bulawayoPercentageCapacity);
    this.branchDailyMinimalCapacityForm.get('gweruStaticCbd').setValue(branchDailyMinimalCapacityOb.gweruStaticCbd);
    this.branchDailyMinimalCapacityForm.get('gweruMob1').setValue(branchDailyMinimalCapacityOb.gweruMob1);
    this.branchDailyMinimalCapacityForm.get('gweruMob2').setValue(branchDailyMinimalCapacityOb.gweruMob2);
    this.branchDailyMinimalCapacityForm.get('gweruMob3').setValue(branchDailyMinimalCapacityOb.gweruMob3);
    this.branchDailyMinimalCapacityForm.get('gweruTotalMinCapacity').setValue(branchDailyMinimalCapacityOb.gweruTotalMinCapacity);
    // this.branchDailyMinimalCapacityForm.get('gweruExpectedDailyCollections').setValue(branchDailyMinimalCapacityOb.gweruExpectedDailyCollections);
    // this.branchDailyMinimalCapacityForm.get('gweruPercentageCapacity').setValue(branchDailyMinimalCapacityOb.gweruPercentageCapacity);
    this.branchDailyMinimalCapacityForm.get('mutareStaticCbd').setValue(branchDailyMinimalCapacityOb.mutareStaticCbd);
    this.branchDailyMinimalCapacityForm.get('mutareMob1').setValue(branchDailyMinimalCapacityOb.mutareMob1);
    this.branchDailyMinimalCapacityForm.get('mutareMob2').setValue(branchDailyMinimalCapacityOb.mutareMob2);
    this.branchDailyMinimalCapacityForm.get('mutareMob3').setValue(branchDailyMinimalCapacityOb.mutareMob3);
    this.branchDailyMinimalCapacityForm.get('mutareTotalMinCapacity').setValue(branchDailyMinimalCapacityOb.mutareTotalMinCapacity);
    // this.branchDailyMinimalCapacityForm.get('mutareExpectedDailyCollections').setValue(branchDailyMinimalCapacityOb.mutareExpectedDailyCollections);
    // this.branchDailyMinimalCapacityForm.get('mutarePercentageCapacity').setValue(branchDailyMinimalCapacityOb.mutarePercentageCapacity);
    this.branchDailyMinimalCapacityForm.get('masvingoStaticCbd').setValue(branchDailyMinimalCapacityOb.masvingoStaticCbd);
    this.branchDailyMinimalCapacityForm.get('masvingoMob1').setValue(branchDailyMinimalCapacityOb.masvingoMob1);
    this.branchDailyMinimalCapacityForm.get('masvingoMob2').setValue(branchDailyMinimalCapacityOb.masvingoMob2);
    this.branchDailyMinimalCapacityForm.get('masvingoMob3').setValue(branchDailyMinimalCapacityOb.masvingoMob3);
    this.branchDailyMinimalCapacityForm.get('masvingoTotalMinCapacity').setValue(branchDailyMinimalCapacityOb.masvingoTotalMinCapacity);
    // this.branchDailyMinimalCapacityForm.get('masvingoExpectedDailyCollections').setValue(branchDailyMinimalCapacityOb.masvingoExpectedDailyCollections);
    // this.branchDailyMinimalCapacityForm.get('masvingoPercentageCapacity').setValue(branchDailyMinimalCapacityOb.masvingoPercentageCapacity);
    this.branchDailyMinimalCapacityForm.get('totalStaticCbd').setValue(branchDailyMinimalCapacityOb.totalStaticCbd);
    this.branchDailyMinimalCapacityForm.get('totalMob1').setValue(branchDailyMinimalCapacityOb.totalMob1);
    this.branchDailyMinimalCapacityForm.get('totalMob2').setValue(branchDailyMinimalCapacityOb.totalMob2);
    this.branchDailyMinimalCapacityForm.get('totalMob3').setValue(branchDailyMinimalCapacityOb.totalMob3);
    this.branchDailyMinimalCapacityForm.get('totalTotalMinCapacity').setValue(branchDailyMinimalCapacityOb.totalTotalMinCapacity);
    // this.branchDailyMinimalCapacityForm.get('totalExDailyCollections').setValue(branchDailyMinimalCapacityOb.totalExpectedDailyCollections);
    this.branchDailyMinimalCapacityForm.get('totalPercentageCapacity').setValue(100);
    // this.branchDailyMinimalCapacityForm.get('fixedPercentage').setValue(branchDailyMinimalCapacityOb.fixedPercentage);
    // this.branchDailyMinimalCapacityForm.get('mobPercentage').setValue(branchDailyMinimalCapacityOb.mobPercentage);
  }

  sumTotalMinCapacity(value,  present?: number) {
    let total = 0;
    if (present === undefined || null) {present = 0; }
    total += value.harareTotalMinCapacity + value.bulawayoTotalMinCapacity + value.gweruTotalMinCapacity +
            value.mutareTotalMinCapacity + value.masvingoTotalMinCapacity + present;
    this.branchDailyMinimalCapacityForm.get('totalTotalMinCapacity').setValue(total);
    this.branchDailyMinimalCapacityForm.get('fixedPercentage').setValue(
      Math.round((value.totalStaticCbd  / total) * 100));
    this.branchDailyMinimalCapacityForm.get('mobPercentage').setValue(
       100 - Math.round((value.totalStaticCbd  / total) * 100));

    console.log(this.branchDailyMinimalCapacityForm.get('harareExpectedDailyCollections').value);
    console.log(value.harareTotalMinCapacity);
    this.branchDailyMinimalCapacityForm.get('hararePercentageCapacity').setValue(
      Math.round((value.harareTotalMinCapacity  / this.branchDailyMinimalCapacityForm.get('harareExpectedDailyCollections').value * 100)));
    this.branchDailyMinimalCapacityForm.get('bulawayoPercentageCapacity').setValue(
    Math.round((value.bulawayoTotalMinCapacity  / this.branchDailyMinimalCapacityForm.get('bulawayoExpectedDailyCollections').value * 100)));
    this.branchDailyMinimalCapacityForm.get('gweruPercentageCapacity').setValue(
      Math.round((value.gweruTotalMinCapacity  / this.branchDailyMinimalCapacityForm.get('gweruExpectedDailyCollections').value * 100)));
    this.branchDailyMinimalCapacityForm.get('mutarePercentageCapacity').setValue(
      Math.round((value.mutareTotalMinCapacity  / this.branchDailyMinimalCapacityForm.get('mutareExpectedDailyCollections').value * 100)));
    this.branchDailyMinimalCapacityForm.get('masvingoPercentageCapacity').setValue(
    Math.round((value.masvingoTotalMinCapacity  / this.branchDailyMinimalCapacityForm.get('masvingoExpectedDailyCollections').value * 100)));
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
    total = value.harareStaticCbd + value.harareMob1 + value.harareMob2 + value.harareMob3;
    this.branchDailyMinimalCapacityForm.get('harareTotalMinCapacity').setValue(total);
    this.sumTotalMinCapacity(value, total - value.harareTotalMinCapacity);
    return total;
  }

  sumBMDCbulawayo(value) {
    let total = 0;
    total = value.bulawayoStaticCbd + value.bulawayoMob1 + value.bulawayoMob2 + value.bulawayoMob3;
    this.branchDailyMinimalCapacityForm.get('bulawayoTotalMinCapacity').setValue(total);
    this.sumTotalMinCapacity(value, total - value.bulawayoTotalMinCapacity);
  }

  sumBMDCgweru(value) {
    let total = 0;
    total = value.gweruStaticCbd + value.gweruMob1 + value.gweruMob2 + value.gweruMob3;
    this.branchDailyMinimalCapacityForm.get('gweruTotalMinCapacity').setValue(total);
    this.sumTotalMinCapacity(value, total - value.gweruTotalMinCapacity);
  }

  sumBMDCmutare(value) {
    let total = 0;
    total = value.mutareStaticCbd + value.mutareMob1 + value.mutareMob2 + value.mutareMob3;
    this.branchDailyMinimalCapacityForm.get('mutareTotalMinCapacity').setValue(total);
    this.sumTotalMinCapacity(value, total - value.mutareTotalMinCapacity);
  }
  sumBMDCmasvingo(value) {
    let total = 0;
    total = value.masvingoStaticCbd + value.masvingoMob1 + value.masvingoMob2 + value.masvingoMob3;
    this.branchDailyMinimalCapacityForm.get('masvingoTotalMinCapacity').setValue(total);
    this.sumTotalMinCapacity(value, total - value.masvingoTotalMinCapacity);
  }

  sumStaticTotal(value): number {
    let total = 0;
    total = value.harareStaticCbd + value.bulawayoStaticCbd + value.gweruStaticCbd
     + value.mutareStaticCbd + value.masvingoStaticCbd;
    this.branchDailyMinimalCapacityForm.get('totalStaticCbd').setValue(total);
    this.sumTotalMinCapacity(value, total - value.harareTotal);
    this.totalStaticCbdValue = total;
    return total;
  }
  sumMob1Total(value) {
    let total = 0;
    total = value.harareMob1 + value.bulawayoMob1 + value.gweruMob1
     + value.mutareMob1 + value.masvingoMob1;
    this.branchDailyMinimalCapacityForm.get('totalMob1').setValue(total);
    this.sumTotalMinCapacity(value, total - value.harareTotal);
  }
  sumMob2Total(value) {
    let total = 0;
    total = value.harareMob2 + value.bulawayoMob2 + value.gweruMob2
     + value.mutareMob2 + value.masvingoMob2;
    this.branchDailyMinimalCapacityForm.get('totalMob2').setValue(total);
    this.sumTotalMinCapacity(value, total - value.harareTotal);
  }
  sumMob3Total(value) {
    let total = 0;
    total = value.harareMob3 + value.bulawayoMob3 + value.gweruMob3
     + value.mutareMob3 + value.masvingoMob3;
    this.branchDailyMinimalCapacityForm.get('totalMob3').setValue(total);
    this.sumTotalMinCapacity(value, total - value.harareTotal);
  }




}
